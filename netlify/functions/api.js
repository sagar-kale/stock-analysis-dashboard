const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
const nodeCron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/.netlify/functions/api', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Get recommendations
app.get('/.netlify/functions/api/recommendations', async (req, res) => {
  try {
    // In a real implementation, this would fetch from a database
    // For now, we'll return the static data
    const recommendations = {
      stocks: [
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy', recommendation: 'Buy', expectedReturn: 15.2 },
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT', recommendation: 'Hold', expectedReturn: 8.5 },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking', recommendation: 'Buy', expectedReturn: 12.7 },
        { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT', recommendation: 'Buy', expectedReturn: 10.3 },
        { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking', recommendation: 'Buy', expectedReturn: 14.1 }
      ],
      mutualFunds: [
        { name: 'Axis Bluechip Fund', category: 'Large Cap', recommendation: 'Buy', expectedReturn: 12.8 },
        { name: 'Mirae Asset Emerging Bluechip', category: 'Large & Mid Cap', recommendation: 'Buy', expectedReturn: 15.3 },
        { name: 'Parag Parikh Flexi Cap Fund', category: 'Flexi Cap', recommendation: 'Buy', expectedReturn: 14.2 },
        { name: 'SBI Small Cap Fund', category: 'Small Cap', recommendation: 'Hold', expectedReturn: 16.7 },
        { name: 'Kotak Emerging Equity Fund', category: 'Mid Cap', recommendation: 'Buy', expectedReturn: 15.9 }
      ],
      monthlyPicks: {
        january: ['RELIANCE.NS', 'Axis Bluechip Fund'],
        february: ['HDFCBANK.NS', 'Mirae Asset Emerging Bluechip'],
        march: ['INFY.NS', 'Parag Parikh Flexi Cap Fund'],
        april: ['TCS.NS', 'SBI Small Cap Fund'],
        may: ['ICICIBANK.NS', 'Kotak Emerging Equity Fund'],
        june: ['RELIANCE.NS', 'Axis Bluechip Fund'],
        july: ['HDFCBANK.NS', 'Mirae Asset Emerging Bluechip'],
        august: ['INFY.NS', 'Parag Parikh Flexi Cap Fund'],
        september: ['TCS.NS', 'SBI Small Cap Fund'],
        october: ['ICICIBANK.NS', 'Kotak Emerging Equity Fund'],
        november: ['RELIANCE.NS', 'Axis Bluechip Fund'],
        december: ['HDFCBANK.NS', 'Mirae Asset Emerging Bluechip']
      },
      lastUpdated: new Date().toISOString()
    };
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Schedule monthly updates
nodeCron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly update job');
  // In a real implementation, this would update the recommendations
  // based on fresh data analysis
});

// For local testing
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Netlify Functions
const handler = serverless(app);
module.exports = { handler };
