import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import { useCommonContext } from './CommonContext';

const FeaturedPost = (props) => {
  const { post} = props;

const {commonState, setCommonState} = useCommonContext();

  // Truncate description to 66 characters
  var truncatedDescription =  '';
  if(post.description !== null){
    truncatedDescription =  post.description.length > 90 ? post.description.slice(0, 90) + '...' : post.description;
  }


  const handleActivePost = () => {
    console.log("commonstate - " + JSON.stringify(commonState) );
    console.log("post.id - " + post.id );
    setCommonState((prevCommonState) => ({
      ...prevCommonState,
      activePostId: post.id,
    }));
  }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component={Link} to="/viewPost" onClick={handleActivePost}>
        <Card sx={{ display: 'flex' }}>
        
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {truncatedDescription}
            </Typography>
            <Typography variant="subtitle1" color="primary">
                  Continue reading...
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
  );
}

export default FeaturedPost;
