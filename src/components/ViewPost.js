import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useCommonContext } from './CommonContext';
import { Button, Container, CssBaseline, Switch, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Reply from './Reply';
import { Link } from 'react-router-dom';

const OpenAIChat = ({content, handleResponse}) => {

  const { setCommonState } = useCommonContext();
  const [toggle, setToggle] = useState(false);

  const generateReply = async () => {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-instruct",
        "prompt": content,
        "max_tokens": 150,
        "presence_penalty": 0.6,
        "temperature": 0.7,
        "top_p": 1
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      // setReply(data.choices[0].text);
      handleResponse(data.choices[0].text);
      setCommonState((prevCommonState) => ({
        ...prevCommonState,
        aiReplyContent: data.choices[0].text
      }));
      // setToggle(!toggle);
    } else {
      // setReply("No reply generated.");
      handleResponse('');
    }
  };

  const handleToggle = () => {
    setToggle(!toggle);
    if (!toggle) {
      generateReply();
      setToggle(!toggle);
    }
  };

  return (
    <div>
      {/* <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={generateReply}>
        Generate Reply
        </Button>
      </Grid> */}
      <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        AI Reply
        <Switch
          checked={toggle}
          onChange={handleToggle}
          color="primary"
        />
      </Grid>
    </div>
  );
};

const ViewPostComponent = () => {
  const { commonState } = useCommonContext();
  const [post, setPost] = useState({});
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState([]);

  const handleReply = (newReply) => {
    console.log(replies);
    setNewReply(newReply);
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/deletePost/${post.id}`, {
        method: 'DELETE',
        headers: {
        //   'Authorization': `Bearer ${commonstate.accessToken}`, // Add authorization header if needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      //onDelete(post.id); // Notify parent component that the post has been deleted
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleResponse = async (content) =>{
    handleReply(content);
  };

  useEffect(() => {

    console.log(commonState);

    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getPost/${commonState.activePostId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [commonState.activePostId, commonState, setReplies, commonState.aiReplyContent]);

  return (
    <>
    <Grid item xs={12} md={6}>
      <CardActionArea component="a">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5" style={{ textAlign: 'center' }}>
              {post.topic}
            </Typography>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={post.image}
            alt={post.imageText}
          />
        </Card>
      </CardActionArea>
    </Grid>
    <Grid item  xs={12}>
        { commonState.role ==='Moderator' && (<Link to="/">
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Delete Post
        </Button>
        </Link>)}
      </Grid>
    <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Replies:
        </Typography>
        <OpenAIChat content={post.description} handleResponse={handleResponse} />
        <Reply onReply={handleReply}  postId ={post.id} author= {commonState.userName} newReply ={newReply}/>
      </Grid>
    </>
  );
};

const defaultTheme = createTheme();

const ViewPost = () =>{

    const { commonState} = useCommonContext();

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
            <ViewPostComponent role = {commonState.role}/>
          </main>
        </Container>
        <Footer
          title="Footer"
          description="Uncover more content by navigating through our posts"
        />
      </ThemeProvider>
    );
  }

export default ViewPost;
