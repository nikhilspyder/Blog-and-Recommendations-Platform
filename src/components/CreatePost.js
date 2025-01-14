import React, { useState } from 'react';
import { Button, Container, CssBaseline, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, createTheme } from '@mui/material';
import { useCommonContext } from './CommonContext';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Header from './Header';
import Footer from './Footer';
// import Blog from './Blog';
// import { v4 as uuidv4 } from 'uuid';


const PostForm = () => {
  
  const topics = ['Academic Resources','Career Services', 'Campus', 'Local Community Resources','Sports',
   'Health and Wellness',  'Technology','Travel','Alumni'];
  const [topic,setTopic] = useState('');

  const history = useNavigate();  // Add useHistory hook

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageText:'',
    date:'',
    topic:'',
    reply:[]
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    var currentDate = Date.now();
    currentDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(currentDate);
    
    setTopic(event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      date: currentDate,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const post = {
    //   post : formData
    // }

    const serverUrl = 'http://localhost:8080/createPost';

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      console.log('Created Post successfully');
    } catch (error) {
      console.error('Error creating a post:', error);
    }

    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form data if needed
    setFormData({ title: '', description: '', image: '' , imageText: ''});

    history('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Create Post Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth>
          <InputLabel id="topic">Select Topic</InputLabel>
          <Select
            id="topic"
            name="topic"
            value={topic}
            onChange={handleInputChange}
            label="Select Topic"
          >
            {topics.map((topicElement) => (
              <MenuItem key={topicElement} value={topicElement}>
                {topicElement}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image Text"
              name="imageText"
              value={formData.imageText}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

const CreatePost = () =>{

  const { commonState} = useCommonContext();
  const defaultTheme = createTheme();

  const memoizedGetIsLoggedIn = React.useCallback(() => {
    return commonState.isLoggedIn;
  }, [commonState.isLoggedIn]);

  React.useEffect(() => {
    memoizedGetIsLoggedIn();
  }, [commonState.isLoggedIn, memoizedGetIsLoggedIn]);

  return (

    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header isLoggedIn={memoizedGetIsLoggedIn} title={commonState.title} sections={commonState.sections} userName={commonState.userName}
        isSubscribed='Subscribe'/>
        <main>
          <PostForm/>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Uncover more content by navigating through our posts"
      />
    </ThemeProvider>
  );

}

export default CreatePost;
