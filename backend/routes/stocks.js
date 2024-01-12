const express = require('express');
const router = express.Router();
const axios = require('axios');

const apiKey = 'cmenkdpr01qqff2lke70cmenkdpr01qqff2lke7g'; // Replace with your FinHub API key

const finhubAPI = axios.create({
  baseURL: 'https://finnhub.io/api/v1/',
  params: {
    token: apiKey,
  },
});

// Example: Get stock profile
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const response = await finhubAPI.get(`/stock/profile2?symbol=${symbol}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock information:', error.response.data);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
