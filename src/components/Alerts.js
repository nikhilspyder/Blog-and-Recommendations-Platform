import React, { useState, useCallback, useEffect } from 'react'; // Import useState hook

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Footer from './Footer';
import { useCommonContext } from './CommonContext';
import { Grid, Typography } from '@mui/material';
import Alert from './Alert';

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const defaultTheme = createTheme();

const Alerts = () => {
  const { commonState } = useCommonContext();
  const [alerts, setAlerts] = useState('');

  const memoizedGetIsLoggedIn = useCallback(() => {
    console.log("commonState - "+JSON.stringify(commonState));
    return commonState.isLoggedIn;
  }, [commonState]);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/getAlert?userName=${commonState.userName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      // const data = [{'id':1,'alert':'Campus'},{'id':2,'alert':'Sports'}];
      console.log("data " + data);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, [commonState.userName, setAlerts]);

  const onDelete = useCallback(async () => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    memoizedGetIsLoggedIn();
    fetchAlerts();
  }, [commonState.isLoggedIn, memoizedGetIsLoggedIn, fetchAlerts]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header isLoggedIn={memoizedGetIsLoggedIn} title={commonState.title} sections={commonState.sections} userName={commonState.userName} isSubscribed='Subscribe'/>
        <main>
          {!commonState.authenticated && <MainFeaturedPost post={mainFeaturedPost}/>}
          {commonState.authenticated && 
            <>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                <Typography variant="h6" gutterBottom>
                  Hello {commonState.userName}, Welcome to our Blog !!!
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                  {alerts && alerts.map((alert) => (
                   <Grid key={alert} item xs={12} md={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                      <Alert alert={alert} onDelete={onDelete} />
                  </Grid>                 
                  ))}
                </Grid>
              </div>
            </>
          }
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );
}

export default Alerts;
