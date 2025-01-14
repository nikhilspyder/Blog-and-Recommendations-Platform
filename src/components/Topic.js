import React, { useState, useEffect } from 'react';
import FeaturedPost from './FeaturedPost';
import { Container, CssBaseline, Grid, InputAdornment, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import Header from './Header';
import { useCommonContext } from './CommonContext';
import Footer from './Footer';
import SearchIcon from '@mui/icons-material/Search';


const TopicPosts = (props) => {
  const { handleActivePost } = props;
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const { commonState, setCommonState } = useCommonContext();
  const [searchQuery, setSearchQuery] = useState('');
  const topic = commonState.topic;

  const [isSubscribed,setIsSubscribed] = useState('');

  const handleSubscribe = async () => {
    console.log('handleSubscribe isSubscribed - '+isSubscribed);

    try {
      const response = await fetch(`http://localhost:8080/subscribeTopic?userName=${commonState.userName}&topic=${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Handle success, maybe show a notification or update UI
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const handleUnsubscribe = async () => {

    console.log('handleUnsubscribe isSubscribed - '+isSubscribed);
    try {
      const response = await fetch(`http://localhost:8080/unsubscribeTopic?userName=${commonState.userName}&topic=${topic}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const checkSubscribe = async () => {
    console.log('isSubscribed - ' + isSubscribed);
  
    if (isSubscribed === 'Subscribe') {
      await handleSubscribe();
      // Update state for corresponding section
      const updatedSections = commonState.sections.map(section => {
        if (section.title === topic) {
          return { ...section, isSubscribed: true };
        }
        return section;
      });
      setCommonState(prevState => ({
        ...prevState,
        sections: updatedSections
      }));
    } else {
      await handleUnsubscribe();
      // Update state for corresponding section
      const updatedSections = commonState.sections.map(section => {
        if (section.title === topic) {
          return { ...section, isSubscribed: false };
        }
        return section;
      });
      setCommonState(prevState => ({
        ...prevState,
        sections: updatedSections
      }));
    }
  }

    // Function to handle search action
    const handleSearch = (event) => {

      const val = event.target.value;
      setSearchQuery(val);

      if (!val) {
        setIsFiltered(false);
        setFilteredPosts([]);
      } else {
        const filteredPosts = posts.filter(post => post.title.includes(val));
        setFilteredPosts(filteredPosts);
        setIsFiltered(true);
      }
    };

  useEffect(() => {

    const getSubscribe = async () => {
        try {
          const response = await fetch(`http://localhost:8080/getSubscribeTopic?topic=${topic}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
    
          if (!response.ok) {
            throw new Error('Failed to subscribe');
          }
          
          if(response.body){
              const responseData = await response.json();
              const isSubscribed = responseData.includes(commonState.userName);
    
              if(isSubscribed){
                  setIsSubscribed('Unsubscribe'); 
              }else{
                setIsSubscribed('Subscribe'); 
              }
          }else{
            setIsSubscribed('Subscribe'); 
          }

        } catch (error) {
          console.error('Error subscribing:', error);
        }
      };

    const fetchPosts = async () => {
      console.log(' --- topic --- ' + topic);
      const serverUrl = `http://localhost:8080/getPost?topic=${topic}`;

      try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
          setPosts('');
          throw new Error('Failed to fetch posts');
        }
        const fetchedPosts = await response.json();
        console.log(fetchedPosts);
        setPosts(fetchedPosts);
      } catch (error) {
        setPosts('');
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
    getSubscribe();
  }, [topic,commonState,isSubscribed]);

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header isLoggedIn={() => {}} title={commonState.title} sections={commonState.sections} userName={commonState.userName} 
         isSubscribed={isSubscribed} checkSubscribe={checkSubscribe}/>
        <main>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Hello {commonState.userName}, Welcome to our Blog - {commonState.topic} section !!!
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <TextField
                  label="Search by title"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
            </div>
          </div>
          <Grid container spacing={4}>

            {isFiltered && filteredPosts && filteredPosts.map((post) => (
              <FeaturedPost key={post.id} post={post} handleActivePost={handleActivePost} />
            ))}
            {!isFiltered && posts && posts.map((post) => (
              <FeaturedPost key={post.id} post={post} handleActivePost={handleActivePost} />
            ))}
          </Grid>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );
};

export default TopicPosts;