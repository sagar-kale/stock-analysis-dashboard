const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

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
  const initialData = fs.readFileSync(path.join(__dirname, '../data/recommendations.json'), 'utf8');
  analysisResults.recommendations = JSON.parse(initialData);
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
  // Trigger the update process
  runAnalysisUpdate()
    .then(() => {
      res.json({ success: true, message: 'Update process triggered' });
    })
    .catch(error => {
      res.status(500).json({ success: false, error: error.message });
    });
});

app.post('/api/admin/approve-recommendations', (req, res) => {
  if (!analysisResults.pendingApproval) {
    return res.status(400).json({ success: false, message: 'No pending recommendations to approve' });
  }
  
  // Save the pending recommendations to the file system
  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/recommendations.json'),
      JSON.stringify(analysisResults.recommendations, null, 2)
    );
    
    analysisResults.pendingApproval = false;
    analysisResults.lastUpdated = new Date().toISOString();
    
    res.json({ success: true, message: 'Recommendations approved and saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI oversight API route
app.post('/api/ai/review-analysis', (req, res) => {
  const { approved, feedback, updatedRecommendations } = req.body;
  
  if (approved && updatedRecommendations) {
    // Update with AI-approved recommendations
    analysisResults.recommendations = updatedRecommendations;
    analysisResults.pendingApproval = false;
    analysisResults.lastUpdated = new Date().toISOString();
    
    // Save to file system
    try {
      fs.writeFileSync(
        path.join(__dirname, '../data/recommendations.json'),
        JSON.stringify(updatedRecommendations, null, 2)
      );
      
      res.json({ success: true, message: 'AI-approved recommendations saved' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    // Store feedback but don't update
    res.json({ 
      success: true, 
      message: 'Feedback received, recommendations not updated',
      feedback
    });
  }
});

// Function to run the analysis update
async function runAnalysisUpdate() {
  console.log('Starting analysis update process...');
  analysisResults.pendingApproval = true;
  
  // Run the Python analysis script
  return new Promise((resolve, reject) => {
    exec('python3 ../scripts/update_analysis.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Analysis script error: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Analysis script stderr: ${stderr}`);
      }
      
      console.log(`Analysis script output: ${stdout}`);
      
      // Try to load the new recommendations
      try {
        const newData = fs.readFileSync(path.join(__dirname, '../data/new_recommendations.json'), 'utf8');
        const newRecommendations = JSON.parse(newData);
        
        // Store as pending for approval
        analysisResults.recommendations = newRecommendations;
        
        // Send to AI for review (would implement actual API call here)
        console.log('Sending to AI for review...');
        
        // In a real implementation, this would be an API call to the AI service
        // For now, we'll just simulate it
        setTimeout(() => {
          console.log('AI review complete');
        }, 1000);
        
        resolve();
      } catch (error) {
        console.error('Error loading new recommendations:', error);
        reject(error);
      }
    });
  });
}

// Schedule monthly updates (runs on the 1st day of each month at 00:00)
cron.schedule('0 0 1 * *', async () => {
  console.log('Running scheduled monthly update...');
  try {
    await runAnalysisUpdate();
    console.log('Monthly update completed successfully');
  } catch (error) {
    console.error('Error in monthly update:', error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app; // For testing
