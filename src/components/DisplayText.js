import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';

const DisplayText = () => {
    const [currentLocation, setCurrentLocation] = useState('');
    const [currentTemp, setCurrentTemp] = useState();
    const [recommendation, setRecommendation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantDetails, setRestaurantDetails] = useState([]);
    const [restaurantNames, setRestaurantNames] = useState([]);

    useEffect(() => {
        const fahrenheitTemp = kelvinToFahrenheit(parseFloat(sessionStorage.getItem('currentTemp')));
        setCurrentLocation(sessionStorage.getItem('currentLocation'));
        setCurrentTemp(fahrenheitTemp);

        const locations = JSON.parse(sessionStorage.getItem('recommendedLocations'));
        const rest = locations.map(r => r.name ? r.name : r.Name);
        setRestaurantNames(rest);
    }, []);

    useEffect(() => {
        callSerAPi();
    }, [restaurantNames]);

    const callSerAPi = async () => {
        try {
            const detailsPromises = restaurantNames.map(async (r) => {
                const details = await searchRestaurantOnProxy(r);
                return details;
            });
            
            const updatedDetails = await Promise.all(detailsPromises);
            setRestaurantDetails(updatedDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            setRestaurantDetails([]);
            setLoading(false);
        }
    };

    const searchRestaurantOnProxy = async (restaurantName) => {
        const apiUrl = `http://localhost:8000/search-restaurant?restaurantName=${encodeURIComponent(restaurantName)}`;

        try {
            const response = await fetch(apiUrl);
            const searchData = await response.json();

            const { title, description, rating, reviews, hours, type, address, phone, gps_coordinates } = searchData.local_results[0];

            const details = {
                name: title,
                description,
                rating,
                reviews,
                hours,
                phone,
                type,
                address,
                lat: gps_coordinates.latitude,
                long: gps_coordinates.longitude
            };

            return details;
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            return null;
        }
    };

    const kelvinToFahrenheit = (kelvin) => {
        if (typeof kelvin !== 'number' || isNaN(kelvin)) {
            return "Invalid input. Please provide a valid temperature in Kelvin.";
        }

        return Math.round((kelvin - 273.15) * (9/5) + 32);
    };

    return (
        <div>
            <h1>Hello</h1>
            <div>
                <Typography variant="h5">Current Location: {currentLocation}</Typography>
                <Typography variant="h5">Current Temperature: {currentTemp && `${currentTemp}°F`}</Typography>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    restaurantDetails.map((restaurant, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    {!restaurant.error && (
                                        <>
                                    {restaurant.name && <Typography variant="h6">{restaurant.name}</Typography>}
                                    {restaurant.description && <Typography variant="body2">{restaurant.description}</Typography>}
                                    {restaurant.reviews && <Typography variant="body2">Rating: {restaurant.rating} ({restaurant.reviews})</Typography>}
                                    {restaurant.hours && <Typography variant="body2">Hours: {restaurant.hours}</Typography>}
                                    {restaurant.phone && <Typography variant="body2">Phone: {restaurant.phone}</Typography>}
                                    {restaurant.type && <Typography variant="body2">Type: {restaurant.type}</Typography>}
                                    {restaurant.address && <Typography variant="body2">Address: {restaurant.address}</Typography>}
                                    </>
                                    )}
                                    {/* {restaurant.error && <Typography variant="body2">Address: {restaurant.address}</Typography>} */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </div>
        </div>
    );
};

export default DisplayText;