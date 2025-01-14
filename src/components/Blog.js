import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';
import Button from '@mui/material/Button';
import FeaturedPosts from './FeaturePosts';
import { useCommonContext } from './CommonContext';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const posts = [post1, post2, post3];


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Blog = () => {

  const { commonState, setCommonState} = useCommonContext();

  const [isSignUpEnabled] = React.useState(false);
  const [isActivePost, setIsActivePost] = React.useState(false);

  const handleOpenRecommendDialog = (section) => {
    // setTopic(section.title); // Update local state
    setCommonState((prevCommonState) => ({
      ...prevCommonState,
      openRecommendDialog: true
    }));
    console.log("commonstate - " + JSON.stringify(commonState) );
  };

  const handleActivePost = (post) =>{
    // alert('Clicked on Active Post');
    setIsActivePost(true);
    // console.log("debug -" + post);
    // console.log("commonState - "+commonState);
    // setActivePost(post);
  }
  

  const memoizedGetIsLoggedIn = React.useCallback(() => {
    // console.log("commonState - "+JSON.stringify(commonState));
    return commonState.isLoggedIn;
  }, [commonState]);

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
        {!commonState.authenticated && <MainFeaturedPost post={mainFeaturedPost}/>}
          { commonState.authenticated &&
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6" gutterBottom>
              Hello {commonState.userName}, Welcome to our Blog !!!
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Link to="/createPost">
                <Button variant="outlined" size="small">
                  Create Post
                </Button>
              </Link>
              {commonState.role === 'Administrator' && (
                <Link to="/admin">
                  <Button variant="outlined" size="small" style={{ marginLeft: '1rem' }}>
                    View Users
                  </Button>
                </Link>
              )}
              <Link to="/recommendActivity">
                <Button variant="outlined" size="small">
                  Recommend Activity
                </Button>
              </Link>
              <Link to="/recommendedForYou">
                <Button variant="outlined" size="small" onClick={handleOpenRecommendDialog}>
                Recommended for You
                </Button>
              </Link>
            </div>
          </div>

            
            {<MainFeaturedPost post={mainFeaturedPost}/>}
            
            <Grid container spacing={4}>
            {  <FeaturedPosts  handleActivePost={handleActivePost} />}
            </Grid> 
            
            { !isSignUpEnabled && !isActivePost &&
              <Grid container spacing={5} sx={{ mt: 3 }}>
            
              <Main title="From the firehose" posts={posts} />
            
              <Sidebar />
              </Grid> 
            } 
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

export default Blog;