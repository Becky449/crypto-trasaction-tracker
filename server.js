const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', transactionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
