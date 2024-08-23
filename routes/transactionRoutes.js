const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /transactions/:address
router.get('/transactions/:address', transactionController.getTransactionsByAddress);

module.exports = router;
