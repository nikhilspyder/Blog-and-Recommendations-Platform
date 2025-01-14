import React, { useState, useEffect } from 'react';
import FeaturedPost from './FeaturedPost';

const FeaturedPosts = (props) => {

    const { handleActivePost} = props;

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const serverUrl = 'http://localhost:8080/getPost';

    try {
      const response = await fetch(serverUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      var fetchedPosts = await response.json();
      fetchedPosts = fetchedPosts.content;
      console.log("fetchedPosts[0].id - " + JSON.stringify(fetchedPosts[0].id));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array to ensure it runs only once on mount

  return (
    <>
      {posts.map((post) => (
        <FeaturedPost key={post.id} post={post} handleActivePost={handleActivePost} />
      ))}
    </>
  );
};

export default FeaturedPosts;
