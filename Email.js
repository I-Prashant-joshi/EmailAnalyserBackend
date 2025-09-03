// MongoDB configuration (for production use)

const mongoose =require('mongoose')

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

module.exports = {Email};