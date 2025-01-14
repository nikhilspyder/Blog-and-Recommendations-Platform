// ReplyComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useCommonContext } from './CommonContext';

const Reply = ({ onReply, postId, author , aiReply}) => {

  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const [posts, setPosts] = useState({});

  const { commonState, setCommonState } = useCommonContext();

  const handleReply = async () => {
    
    if (replyText.trim() !== '') {
        console.log('Inside handleReply');

        var currentDate = Date.now();
        currentDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(currentDate);    

        const newReply = {
            id: uuidv4(),
            author: author,
            date : currentDate,
            replyContent: replyText,
        };

        const updatedReplies = [...replies, newReply];
        // Find the index of the post in the posts array
        const postIndex = posts.findIndex((p) => p.id === postId);

        const post = posts.find((p) => p.id === postId);
        console.log("post - " + post);

        posts[postIndex].reply = updatedReplies;
        
        console.log("posts"+ JSON.stringify(posts));

        // Make PUT request to insert new reply
        const response = await fetch(`http://localhost:8080/updatePost`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(posts[postIndex]),
        });

        if (!response.ok) {
            throw new Error('Failed to add reply');
        }
  

      onReply(replyText);
      setReplyText('');
      setCommonState((prevCommonState) => ({
        ...prevCommonState,
        aiReplyContent: '',
      }));
      fetchReplies();
    }
  };

  // Function to fetch all replies for the current post
  const fetchReplies = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/getPost');
      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }
      var allReplies = await response.json();

      allReplies = allReplies.content;

      setPosts(allReplies);

      console.log("allReplies" +JSON.stringify(allReplies.find((post) => post.id === postId)));

      // setPost(allReplies.find((post) => post.id === postId));
      // Find replies for the specific post
      const postReplies = allReplies.find((post) => post.id === postId)?.reply || [];
      console.log("postReplies" +JSON.stringify(postReplies));
      setReplies(postReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  }, [postId]);

  // Fetch replies on component mount
  useEffect(() => {

    console.log('Updated AI Reply ' +commonState.aiReplyContent);

    if(commonState.aiReplyContent){
      console.log("aiReply - "+commonState.aiReplyContent);
      setReplyText(commonState.aiReplyContent);
    }
    fetchReplies();
  }, [fetchReplies,aiReply, commonState.aiReplyContent, replyText, setReplyText]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={11}>
        <TextField
          fullWidth
          label="Your Reply"
          variant="outlined"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      </Grid>
      <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleReply}>
          Reply
        </Button>
      </Grid>
      {replies.length > 0 && replies.map((reply) => (
        <Grid item xs={12} key={reply.id}>
            <Typography variant="subtitle2" color="textSecondary">
            {reply.author} {reply.date}
            </Typography>
            <div>{reply.replyContent}</div>
        </Grid>
        ))}
    </Grid>
  );
};

export default Reply;
