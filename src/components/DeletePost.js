import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import { useCommonContext } from './CommonContext';

const Post = ({ post, onDelete }) => {
  const { commonstate } = useCommonContext();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/deletePost/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${commonstate.accessToken}`, // Add authorization header if needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      onDelete(post.id); // Notify parent component that the post has been deleted
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{post.title}</Typography>
        <Typography variant="body1">{post.description}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Delete Post
        </Button>
      </Grid>
    </Grid>
  );
};

export default Post;
