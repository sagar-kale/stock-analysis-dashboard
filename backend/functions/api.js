const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Store for analysis results
let analysisResults = {
  lastUpdated: new Date().toISOString(),
  pendingApproval: false,
  recommendations: null
};

// Load initial recommendations
try {
  // In Netlify Functions, we need to use a different approach to load data
  // This would typically be from a database in production
  // For this example, we'll initialize with empty data
  analysisResults.recommendations = {
    top_stocks: [],
    top_mutual_funds: [],
    monthly_stock_picks: {},
    monthly_mf_picks: {}
  };
  
  // In a real implementation, we would fetch this from a database
  // or use Netlify environment variables
} catch (error) {
  console.error('Error loading initial recommendations:', error);
  analysisResults.recommendations = {
    top_stocks: [],
    top_mutual_funds: [],
    monthly_stock_picks: {},
    monthly_mf_picks: {}
  };
}

// API Routes
app.get('/api/recommendations', (req, res) => {
  res.json({
    lastUpdated: analysisResults.lastUpdated,
    pendingApproval: analysisResults.pendingApproval,
    recommendations: analysisResults.recommendations
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    lastUpdated: analysisResults.lastUpdated,
    pendingApproval: analysisResults.pendingApproval
  });
});

// Admin routes (would need proper authentication in production)
app.post('/api/admin/trigger-update', (req, res) => {
  // In Netlify Functions, we can't run long-running processes
  // This would need to be implemented differently, such as triggering
  // a webhook that runs a separate process
  res.json({ 
    success: true, 
    message: 'Update process would be triggered in a production environment' 
  });
});

app.post('/api/admin/approve-recommendations', (req, res) => {
  if (!analysisResults.pendingApproval) {
    return res.status(400).json({ success: false, message: 'No pending recommendations to approve' });
  }
  
  // In Netlify Functions, we would update a database instead of the file system
  analysisResults.pendingApproval = false;
  analysisResults.lastUpdated = new Date().toISOString();
  
  res.json({ success: true, message: 'Recommendations approved' });
});

// AI oversight API route
app.post('/api/ai/review-analysis', (req, res) => {
  const { approved, feedback, updatedRecommendations } = req.body;
  
  if (approved && updatedRecommendations) {
    // Update with AI-approved recommendations
    analysisResults.recommendations = updatedRecommendations;
    analysisResults.pendingApproval = false;
    analysisResults.lastUpdated = new Date().toISOString();
    
    res.json({ success: true, message: 'AI-approved recommendations saved' });
  } else {
    // Store feedback but don't update
    res.json({ 
      success: true, 
      message: 'Feedback received, recommendations not updated',
      feedback
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

// Export the serverless handler for Netlify Functions
module.exports.handler = serverless(app);
