const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
// const { Client } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://localhost:9200' });
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());


app.get('/search-restaurant', async (req, res) => {
    const apiKey = '2086a553ec2700eab5fc070b8253437325729dd6089471210b51d631a96e5734';
    let { restaurantName } = req.query;
  
    // Encode the restaurantName parameter
    restaurantName = encodeURIComponent(restaurantName);
  
    const apiUrl = `https://serpapi.com/search.json?q=${restaurantName}&uule=w+CAIQICIeQ2hpY2FnbyxJbGxpbm9pcyxVbml0ZWQgU3RhdGVz&tbm=lcl&apikey=${apiKey}`;
  
    try {
        const response = await fetch(apiUrl);
        const searchData = await response.json();
        res.json(searchData);
    } catch (error) {
        console.error('Error fetching SERP API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });