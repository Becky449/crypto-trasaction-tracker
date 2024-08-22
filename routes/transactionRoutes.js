// transactionRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load environment variables from the .env file

// GET /transactions/:address
router.get('/transactions/:address', async (req, res) => {
  const { address } = req.params;

  const options = {
    method: 'GET',
    url: `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`,
    params: {
      chain: 'eth',
      limit: 5 // Limit the number of transactions to 5
    },
    headers: {
      'x-api-key': process.env.MORALIS_API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data); // Respond with the limited ERC-20 transfer data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving ERC-20 transfers' });
  }
});

module.exports = router;
