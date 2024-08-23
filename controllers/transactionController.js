const axios = require('axios');
const { isAddress } = require('web3-validator');
const Transaction = require('../models/Transaction');
require('dotenv').config();
const { Web3 } = require('web3');
const web3 = new Web3();

// Fetch and store transactions
exports.getTransactionsByAddress = async (req, res) => {
  const { address } = req.params;

  // Validate the Ethereum address format
  if (!isAddress(address.trim())) {
    return res.status(400).json({ message: 'Invalid Ethereum address format' });
  }

  console.log('Querying transactions for address:', address);

  const options = {
    method: 'GET',
    url: `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`,
    params: { chain: 'eth' }, // Specify the blockchain (e.g., Ethereum mainnet)
    headers: {
      'x-api-key': process.env.MORALIS_API_KEY
    }
  };

  try {
    // Fetch transactions from Moralis
    const response = await axios.request(options);
    console.log('Moralis Response:', response.data);

    if (!Array.isArray(response.data.result)) {
      return res.status(500).json({ message: 'Unexpected response format from Moralis', data: response.data });
    }

    const transactions = response.data.result;
    const limitedTransactions = transactions.slice(0, 5); // Limit to 5 transactions

    await Transaction.insertMany(limitedTransactions.map(tx => ({
      address: tx.to || tx.from,
      blockNumber: tx.block_number,
      timeStamp: new Date(tx.block_timestamp), // Moralis returns ISO format timestamps
      hash: tx.transaction_hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gas_price
    })));

    res.json(limitedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving transactions' });
  }
};
