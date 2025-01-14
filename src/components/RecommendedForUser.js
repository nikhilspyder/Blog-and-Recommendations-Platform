import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, ThemeProvider, CssBaseline, createTheme, Grid, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Header from './Header';
import { useCommonContext } from './CommonContext';
import Footer from './Footer';
import MapDisplay from './MapDisplay';
import DisplayText from './DisplayText';

const RecommendedForUser = () => {
//   const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [ recommendation,setRecommendation] = useState('');
  const {commonState, setCommonState} = useCommonContext();
  const [city, setCity] = useState('');

  const handleCloseRecommendDialog = () => {
    console.log(recommendation);
    setCommonState((prevCommonState) => ({
      ...prevCommonState,
      openRecommendDialog: false
    }));
    console.log("commonstate - " + JSON.stringify(commonState) );
  };

  useEffect(() => {
    // Fetch user location
    const fetchLocationAndWeather = async () => {
        let data='';
      try {
        const response = await fetch('https://ipapi.co/json/');
        data = await response.json();
        setCity(data.city);
        // setLongitude(data.longitude);
        // setLatitude(data.latitude);
        console.log('city data - ' + JSON.stringify(data.city));
        console.log('latitude data - ' + JSON.stringify(data.latitude));
        console.log('longitude data - ' + JSON.stringify(data.longitude));
      } catch (error) {
        console.error('Error fetching location:', error);
      }

      const apiKey = 'f464f3119e2d467b1d3ac2e117cd47ca';
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${apiKey}`;
        //   https://api.openweathermap.org/data/2.5/weather?lat=41.8486&lon=-87.6288&appid=f464f3119e2d467b1d3ac2e117cd47ca
          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            // console.log('weather data - ' + JSON.stringify(data));
            console.log('weather data - ' + JSON.stringify(data.weather[0].description));
            setWeatherData(data.weather[0].description);
            // console.log(weatherData);
            console.log('Today, weather is '+weatherData+', suggest me real time activities in '+city);
            setUserQuery('Today, weather is '+weatherData+', suggest me real time activities in '+city);
          } catch (error) {
            console.error('Error fetching weather:', error);
          }

    };

    fetchLocationAndWeather();
  }, [city,weatherData]);

    // Fetch weather data based on user location

  const handleSearch = async () => {
    const openAiResponse = await fetchOpenAiResponse(userQuery);
    setRecommendation(openAiResponse);
  };

  const fetchOpenAiResponse = async (query) => {

    console.log(query);
    // Make request to OpenAI API
    const apiKey = 'Bearer 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';
    const apiUrl = 'https://api.openai.com/v1/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${apiKey}`
    };
    const data = {
      model: 'gpt-3.5-turbo-instruct', // GPT-3.5 model
      prompt: query,
      presence_penalty: 0.6,
      temperature: 0.7,
      max_tokens:100,
      top_p: 1
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      const res = responseData.choices[0].text.trim();
    //   return res.split(/\d+\.\s+/).filter(Boolean);
      return res;
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return 'Error fetching recommendation. Please try again later.';
    }
  };

  const defaultTheme = createTheme();

  return (
<ThemeProvider theme={defaultTheme}>
<CssBaseline />
<Container maxWidth="lg">
  <Header isLoggedIn={() => {}} title={commonState.title} sections={commonState.sections} userName={commonState.userName} />
  {/* <main> */}
  <Grid container direction="column" alignItems="center" justifyContent="center" marginTop="1rem" marginBottom="1rem" width="100%">
          <Typography variant="h6" gutterBottom>
            Hello {commonState.userName}, Welcome to our Blog !!!
          </Typography>
          <Container maxWidth="sm">
            <Grid item container justifyContent="center">
              <Typography variant="h6">Recommend Activity based on real-time weather and location:</Typography>
            </Grid>
            <Grid item container justifyContent="center">
              <Button variant="contained" onClick={handleSearch}>Recommend</Button>
            </Grid>
            <Typography variant="h2" gutterBottom></Typography>
            
            <Dialog fullWidth maxWidth="lg"  open={commonState.openRecommendDialog} onClose={handleCloseRecommendDialog}>
              <DialogTitle>Recommended for You</DialogTitle>
              <DialogContent style={{width:'100%', overflowY: 'auto'}}>
                <MapDisplay style={{height:'50%'}}/>
                <DisplayText />
                {/* <h1>Hello</h1> */}
              </DialogContent>
            </Dialog>

            
          </Container>
        </Grid>
  {/* </main> */}
</Container>
<Footer
  title="Footer"
  description="Uncover more content by navigating through our posts"
/>
</ThemeProvider>
  );
};

export default RecommendedForUser;
