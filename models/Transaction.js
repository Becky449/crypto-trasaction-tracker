const mongoose = require('mongoose');

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

module.exports = Transaction;
