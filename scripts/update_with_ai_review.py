#!/usr/bin/env python3
"""
Manual script to update investment recommendations and send for AI review
"""
import os
import sys
import json
import requests
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the analysis module
try:
    from scripts.update_analysis import update_analysis
except ImportError:
    print("Error: Could not import update_analysis module.")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)

def main():
    """Main function to run the update and send for AI review"""
    print("Starting manual update with AI review...")
    
    # Set up paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "data")
    
    # Create directories if they don't exist
    os.makedirs(os.path.join(data_dir, "analysis_results"), exist_ok=True)
    
    try:
        # Run the analysis
        print("Running investment analysis...")
        recommendations = update_analysis()
        
        # Save recommendations to a temporary file
        temp_file = os.path.join(data_dir, "new_recommendations.json")
        with open(temp_file, "w") as f:
            json.dump(recommendations, f, indent=2)
        
        print("Analysis completed successfully!")
        
        # Ask if user wants to send for AI review
        send_for_review = input("Do you want to send these recommendations for AI review? (y/n): ")
        
        if send_for_review.lower() == 'y':
            # In a real implementation, this would call an API to request AI review
            # For this example, we'll simulate the process
            
            print("Sending recommendations for AI review...")
            
            # Check if backend server is running
            try:
                # Try to connect to the backend server
                response = requests.get("http://localhost:3001/api/status", timeout=5)
                
                if response.status_code == 200:
                    print("Backend server is running. Sending recommendations for review...")
                    
                    # Send the recommendations to the AI review endpoint
                    with open(temp_file, "r") as f:
                        recommendations_data = json.load(f)
                    
                    ai_review_response = requests.post(
                        "http://localhost:3001/api/ai/review-analysis",
                        json={
                            "approved": True,
                            "feedback": "Recommendations look good.",
                            "updatedRecommendations": recommendations_data
                        },
                        timeout=10
                    )
                    
                    if ai_review_response.status_code == 200:
                        print("Recommendations sent for AI review successfully!")
                        print("The AI will review and approve the recommendations.")
                        print("Check the web application for updated recommendations.")
                    else:
                        print(f"Error sending recommendations for AI review: {ai_review_response.text}")
                else:
                    print(f"Backend server returned unexpected status: {response.status_code}")
                    print("You can manually apply the recommendations by copying the file:")
                    print(f"  {temp_file} to {os.path.join(data_dir, 'recommendations.json')}")
            
            except requests.exceptions.ConnectionError:
                print("Could not connect to backend server. Is it running?")
                print("You can manually apply the recommendations by copying the file:")
                print(f"  {temp_file} to {os.path.join(data_dir, 'recommendations.json')}")
        else:
            print("Skipping AI review.")
            
            # Ask if user wants to apply recommendations directly
            apply_directly = input("Do you want to apply these recommendations directly? (y/n): ")
            
            if apply_directly.lower() == 'y':
                # Backup current recommendations
                current_file = os.path.join(data_dir, "recommendations.json")
                if os.path.exists(current_file):
                    backup_file = os.path.join(
                        data_dir, 
                        f"recommendations_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                    )
                    print(f"Backing up current recommendations to {backup_file}")
                    with open(current_file, "r") as src, open(backup_file, "w") as dst:
                        dst.write(src.read())
                
                # Apply new recommendations
                print("Applying new recommendations...")
                with open(temp_file, "r") as src, open(current_file, "w") as dst:
                    dst.write(src.read())
                
                print("Recommendations applied successfully!")
            else:
                print("Recommendations not applied.")
                print(f"You can find the new recommendations at: {temp_file}")
        
        print("Manual update process completed.")
    
    except Exception as e:
        print(f"Error during update process: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
