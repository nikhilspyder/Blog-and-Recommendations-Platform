import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, ThemeProvider, CssBaseline, createTheme, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import Header from './Header';
import { useCommonContext } from './CommonContext';
import Footer from './Footer';

const RecommendActivity = () => {
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const {commonState} = useCommonContext();
  const [userQuery, setUserQuery] = useState('');
  // const [recommendation, setRecommendation] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const currentLocation = `${data.city}, ${data.region}, ${data.country_code_iso3}`
        sessionStorage.setItem('currentLocation', currentLocation);
       
        const defaultLocation = { type:"defaultLoc", name:"Current location", latitude: data.latitude, longitude: data.longitude }; // Combined default location
        sessionStorage.setItem('defaultLocation', JSON.stringify(defaultLocation));
        setCity(data.city);
        const apiKey = 'f464f3119e2d467b1d3ac2e117cd47ca';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${apiKey}`;
        const weatherResponse = await fetch(apiUrl);
        const weatherData = await weatherResponse.json();
        sessionStorage.setItem('currentTemp',weatherData.main.temp);
        setWeatherData(weatherData.weather[0].description);
        const localweather = weatherData.weather[0].description;
        sessionStorage.setItem('currentWeather',localweather);
       
        setUserQuery(`Today, weather is ${localweather}, suggest me 3 restaurants, 3 musical events/concerts and 3 sports events along with their correct location's latitude and longitude in positive and negative values in ${data.city}}. Return these statements as a JSON Object with the structure [{Name:string, Address:string Description:string, latitude:float, longitude: float}]. Do not return any non-json text or numbering.`);
      } catch (error) {
        console.error('Error fetching location and weather:', error);
      }
    };

    fetchLocationAndWeather();
  }, []);

  const handleSearch = async () => {
    setLoading(true); // Set loading state to true before fetching data

    try {
      const openAiResponse = await fetchOpenAiResponse();
      setRecommendation(openAiResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRecommendation([]); // Reset recommendation on error
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  const fetchOpenAiResponse = async () => {
    const userQuery = generateUserQuery();
    const apiKey = 'Bearer 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';
    const apiUrl = 'https://api.openai.com/v1/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${apiKey}`
    };
    const data = {
      model: 'gpt-3.5-turbo-instruct',
      prompt: userQuery,
      max_tokens: 1800,
      temperature: 0.7,
      top_p: 1
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch OpenAI response');
      }

      const responseData = await response.json();

      if (responseData && responseData.choices && responseData.choices.length > 0) {
        const text = responseData.choices[0].text;
        if (text) {
          const parsedJson = tryParseJson(text);
          return parsedJson || [];
        }
      }

      return [];
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return [];
    }
  };

  const tryParseJson = (text) => {
    return JSON.parse(text)
    // try {
    //   const cleanedResponseText = text.replace(/,\s*]/g, ']');
    //   return JSON.parse(cleanedResponseText);
    // } catch (error) {
    //   console.error('Error parsing JSON:', error);
    //   return null;
    // }
  };

  const generateUserQuery = () => {
    const weatherDescription = sessionStorage.getItem('currentWeather');
    const city = sessionStorage.getItem('currentLocation');
    return `Today, weather is ${weatherDescription}. Recommend me top rated 3 restaurants, 3 musical events and 3 sports events along with their correct location's latitude and longitude in positive and negative values in ${city}. Strictly return these statements as a JSON Object with the structure [{type: string, Name:string(restaurant/musicalEvent/sportEvent), Address:string, Description:string, latitude:float, longitude: float}]. Do not return any non-json text or numbering.`;
  };

  const saveLocationsToStorage = (locations) => {
    sessionStorage.setItem('recommendedLocations', JSON.stringify(locations));
  };

  useEffect(() => {
    saveLocationsToStorage(recommendation);
  }, [recommendation]);

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title={commonState.title} sections={commonState.sections} userName={commonState.userName}
        isSubscribed='Subscribe'/>
        {/* <main> */}
        {/* {!commonState.authenticated && <MainFeaturedPost post={mainFeaturedPost}/>} */}
          { commonState.authenticated &&
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Hello {commonState.userName}, Welcome to our Blog !!!
            </Typography>
            <Grid item container justifyContent="center">
              <Button variant="contained" onClick={handleSearch}>Recommend</Button>
            </Grid>
            
            {/* Conditionally show loading spinner */}
        {loading ? (
          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <CircularProgress />
          </Grid>
        ) : (
          recommendation.length > 0 && (
            <Grid item>
              {recommendation.map((activity, index) => (
                <Card key={index} style={{ marginBottom: '10px' }}>
                  <CardContent>
                    <Typography variant="h6">{activity.name ? activity.name : activity.Name}</Typography>
                    <Typography variant="body1">{activity.description ? activity.description : activity.Description}</Typography>
                    <Typography variant="body2">Address: {activity.address ? activity.address : activity.Address}</Typography>
                    {/* Include latitude and longitude if needed */}
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )
        )}
          </div>
          </>
          }
          
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );
};

export default RecommendActivity;