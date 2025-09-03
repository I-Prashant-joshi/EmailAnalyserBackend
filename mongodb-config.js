// MongoDB configuration (for production use)
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email-analysis');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Email Schema
const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
   from: {
    type: String
  },
  receivingChain: [{
    type: String
  }],
 
  espType: {
    type: String,
    required: true
  },
  rawHeaders: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Email = mongoose.model('Email', emailSchema);

module.exports = { connectDB, Email };