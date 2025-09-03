require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { fetchEmailFromIMAP } = require('./imap-config');
const mongoose =require('mongoose')
const app = express();
const PORT = process.env.PORT || 3001;
const nodemailer = require("nodemailer");
const { Email } = require("./Email");
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],credentials: true
}));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));


// Middleware
app.use(express.json());

// ESP Detection Function
function detectESP(headers) {
  const headerString = JSON.stringify(headers).toLowerCase();

  if (headerString.includes('gmail.com') || headerString.includes('googlemail.com')) {
    return 'Gmail';
  } else if (headerString.includes('outlook.com') || headerString.includes('hotmail.com') || headerString.includes('live.com')) {
    return 'Outlook';
  } else if (headerString.includes('zoho.com')) {
    return 'Zoho';
  } else if (headerString.includes('amazonses.com') || headerString.includes('amazonaws.com')) {
    return 'Amazon SES';
  } else if (headerString.includes('sendgrid.net')) {
    return 'SendGrid';
  } else if (headerString.includes('mailgun.org')) {
    return 'Mailgun';
  } else {
    return 'Unknown';
  }
}

// Extract Receiving Chain
function extractReceivingChain(headers) {
  const received = headers.received || [];
  return received.map(r => r.trim());
}

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Email Analysis API is running!' });
});
// Generate Ethereal test account (for frontend)
app.get('/api/create-test-account', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: "prashantjoshipj67@gmail.com"
    });
  } catch (error) {
    console.error("Error creating test account:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create test account"
    });
  }
});


// Main route: fetch email, analyze, and save
app.post('/api/fetch-email', async (req, res) => {
  try {
    const { subject } = req.body;

    // 🔥 Use real IMAP fetch function
    const emailData = await fetchEmailFromIMAP(subject);

    if (!emailData) {
      return res.status(404).json({
        success: false,
        error: 'No matching email found'
      });
    }

    // Process headers
    const receivingChain = extractReceivingChain(emailData.headers);
    const espType = detectESP(emailData.headers);
   
    const emailRecord = new Email({
      subject: emailData.subject,
      from:emailData.from,
      receivingChain,
      espType,
      rawHeaders: emailData.headers,
      createdAt: new Date()
    });

    await emailRecord.save();

    res.status(200).json({
      success: true,
      data: emailRecord
    });

  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email'
    });
  }
});

// Fetch stored emails
app.get('/api/emails', async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: emails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stored emails'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
