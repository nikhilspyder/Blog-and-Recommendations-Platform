import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const MapDisplay = ({ google }) => {
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  

  useEffect(() => {
    const savedActivities = sessionStorage.getItem('recommendedLocations');
    const defaultLocation = sessionStorage.getItem('defaultLocation');
    const defaultLocationObj = defaultLocation ? JSON.parse(defaultLocation) : null;
    

    if (savedActivities) {
      const jsonRes = JSON.parse(savedActivities);

      // Add default location to jsonRes
      if (defaultLocationObj) {
        jsonRes.push({
          type: 'defaultLoc',
          name: 'Default Location',
          latitude: defaultLocationObj.lat ? defaultLocationObj.lat : defaultLocationObj.latitude,
          longitude: defaultLocationObj.long ? defaultLocationObj.long : defaultLocationObj.longitude,
        });
      }

      // Map jsonRes to locationsData
      const locationsData = jsonRes.map(({ type, name, latitude, longitude }) => {
        let iconColor = '';
        switch (type) {
          case 'defaultLoc':
            iconColor = 'green';
            break;
          case 'restaurant':
            iconColor = 'red';
            break;
          case 'musicalEvent':
            iconColor = 'yellow';
            break;
          case 'sportEvent':
            iconColor = 'blue';
            break;
          default:
            iconColor = 'black'; // Default color if type is unrecognized
            break;
        }
      
        return {
          type,
          name: name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          iconColor,
        };
      });
  
      // Update locations state
      setLocations(locationsData);
      console.log('locationsData updated:', locationsData);
    }
  }, []); // Empty dependency array ensures this effect runs only on component mount

  const handleMarkerClick = (props, marker, e) => {
    setSelectedLocation(props); // Set the selected location to the marker's props
    setActiveMarker(marker); // Set the active marker
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
    setSelectedLocation(null);
  };

  return (
    <div style={{ width: '100%', minHeight: '500px', position: 'relative' }}>
      <Map
        google={google}
        zoom={12}
        initialCenter={{ lat: 41.8781, lng: -87.6298 }} // Default center for Chicago, IL
        style={{ width: '100%', height: '100%', position: 'relative' }}
        containerStyle={{ width: '100%', height: '100%' }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            title={location.name}
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={handleMarkerClick}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${location.iconColor}-dot.png`,
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        ))}

        <InfoWindow
          marker={activeMarker}
          visible={activeMarker !== null}
          onClose={handleInfoWindowClose}
        >
          <div>
            <h3>{selectedLocation && selectedLocation.title}</h3>
          </div>
        </InfoWindow>
      </Map>
      
     
      
      <br />
      <br />
      {/* <h1>{currentLocation}</h1> */}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBdbhXostQtLjwu9GmzJC8yBZNJoD0HsEo'
})(MapDisplay);
