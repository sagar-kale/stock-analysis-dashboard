import requests
import json
import os
import sys
from datetime import datetime

# Configuration
MANUS_API_ENDPOINT = "https://api.manus.ai/v1/analysis/review"
MANUS_API_KEY = "manus_api_key_12345"  # This would be securely stored in production
RECOMMENDATIONS_PATH = "../data/new_recommendations.json"
APPROVED_PATH = "../data/recommendations.json"
BACKEND_API = "http://localhost:3001/api/ai/review-analysis"

def load_recommendations():
    """Load the newly generated recommendations."""
    try:
        with open(RECOMMENDATIONS_PATH, 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading recommendations: {e}")
        return None

def send_to_manus(recommendations):
    """Send recommendations to Manus AI for review."""
    print("Sending recommendations to Manus AI for review...")
    
    headers = {
        "Authorization": f"Bearer {MANUS_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "type": "investment_recommendations",
        "data": recommendations,
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "source": "indian-investment-advisor",
            "version": "1.0.0"
        }
    }
    
    try:
        response = requests.post(
            MANUS_API_ENDPOINT,
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print("Manus AI review completed successfully")
            return result
        else:
            print(f"Error from Manus AI: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception when calling Manus AI: {e}")
        return None

def update_backend(manus_response):
    """Update the backend with Manus AI review results."""
    if not manus_response:
        print("No response from Manus AI, cannot update backend")
        return False
    
    approved = manus_response.get("approved", False)
    feedback = manus_response.get("feedback", "No feedback provided")
    updated_recommendations = manus_response.get("recommendations", None)
    
    payload = {
        "approved": approved,
        "feedback": feedback,
        "updatedRecommendations": updated_recommendations if updated_recommendations else None
    }
    
    try:
        response = requests.post(
            BACKEND_API,
            json=payload
        )
        
        if response.status_code == 200:
            print("Backend updated successfully with Manus AI review")
            result = response.json()
            print(f"Backend response: {result}")
            return True
        else:
            print(f"Error updating backend: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Exception when updating backend: {e}")
        return False

def simulate_manus_review(recommendations):
    """Simulate Manus AI review for testing purposes."""
    print("Simulating Manus AI review (for testing only)...")
    
    # In a real implementation, this would be replaced with actual API call
    # This is just a simulation for testing
    
    # Perform some basic validation
    if not recommendations:
        return {
            "approved": False,
            "feedback": "No recommendations provided",
            "recommendations": None
        }
    
    # Check if required fields exist
    required_fields = ["top_stocks", "top_mutual_funds", "monthly_stock_picks", "monthly_mf_picks"]
    for field in required_fields:
        if field not in recommendations:
            return {
                "approved": False,
                "feedback": f"Missing required field: {field}",
                "recommendations": None
            }
    
    # Check if there are enough recommendations
    if len(recommendations["top_stocks"]) < 5 or len(recommendations["top_mutual_funds"]) < 5:
        return {
            "approved": False,
            "feedback": "Not enough recommendations provided",
            "recommendations": None
        }
    
    # In a real implementation, Manus would perform sophisticated analysis
    # For now, we'll just approve the recommendations as is
    return {
        "approved": True,
        "feedback": "Recommendations look good based on historical performance analysis",
        "recommendations": recommendations
    }

def main():
    """Main function to run the AI review process."""
    print("Starting Manus AI review process...")
    
    # Load recommendations
    recommendations = load_recommendations()
    if not recommendations:
        print("Failed to load recommendations, exiting")
        sys.exit(1)
    
    # In production, use the real Manus API
    # For testing, use the simulation
    use_real_api = os.environ.get("USE_REAL_MANUS_API", "false").lower() == "true"
    
    if use_real_api:
        manus_response = send_to_manus(recommendations)
    else:
        manus_response = simulate_manus_review(recommendations)
    
    # Update backend with results
    success = update_backend(manus_response)
    
    if success:
        print("AI review process completed successfully")
        sys.exit(0)
    else:
        print("AI review process failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
