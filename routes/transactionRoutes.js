const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// MongoDB schema and model
const transactionSchema = new mongoose.Schema({
  address: String,
  blockNumber: String,
  timeStamp: Date, // Store as Date object
  hash: String,
  from: String,
  to: String,
  value: String,
  gas: String,
  gasPrice: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// GET /transactions/:address
router.get('/transactions/:address', async (req, res) => {
  const { address } = req.params;

  // Log the address being queried
  console.log('Querying transactions for address:', address);

  const options = {
    method: 'GET',
    url: `https://api.etherscan.io/api`,
    params: {
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: 0,
      endblock: 99999999,
      sort: 'desc',
      apikey: process.env.ETHERSCAN_API_KEY
    }
  };

  // Log the full URL
  console.log('Etherscan API URL:', `${options.url}?module=${options.params.module}&action=${options.params.action}&address=${options.params.address}&startblock=${options.params.startblock}&endblock=${options.params.endblock}&sort=${options.params.sort}&apikey=${options.params.apikey}`);

  try {
    // Fetch transactions from Etherscan
    const response = await axios.request(options);

    console.log('Etherscan Response:', response.data); // Log the response

    const transactions = response.data.result;

    if (!Array.isArray(transactions)) {
      return res.status(500).json({ message: 'Unexpected response format from Etherscan', data: response.data });
    }

    const limitedTransactions = transactions.slice(0, 5); // Limit to 5 transactions

    // Store transactions in MongoDB
    await Transaction.insertMany(limitedTransactions.map(tx => ({
      address: tx.to || tx.from,
      blockNumber: tx.blockNumber,
      timeStamp: new Date(tx.timeStamp * 1000), // Convert to Date object
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice
    })));

    res.json(limitedTransactions); // Respond with the fetched transactions
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving transactions' });
  }
});
