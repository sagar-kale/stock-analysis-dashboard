#!/bin/bash
# update_recommendations.sh - Script to manually update investment recommendations

echo "Starting manual update of investment recommendations..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if required Python packages are installed
echo "Checking required Python packages..."
python3 -c "import pandas, numpy, matplotlib" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required Python packages..."
    pip3 install pandas numpy matplotlib requests
fi

# Set up directory paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_ROOT/data"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Create directories if they don't exist
mkdir -p "$DATA_DIR/analysis_results"

# Run the analysis script
echo "Running analysis script..."
python3 "$SCRIPTS_DIR/update_analysis.py"

if [ $? -eq 0 ]; then
    echo "Analysis completed successfully!"
    
    # Check if new recommendations were generated
    if [ -f "$DATA_DIR/new_recommendations.json" ]; then
        echo "New recommendations generated."
        
        # Backup current recommendations
        if [ -f "$DATA_DIR/recommendations.json" ]; then
            BACKUP_FILE="$DATA_DIR/recommendations_backup_$(date +%Y%m%d_%H%M%S).json"
            echo "Backing up current recommendations to $BACKUP_FILE"
            cp "$DATA_DIR/recommendations.json" "$BACKUP_FILE"
        fi
        
        # Apply new recommendations
        echo "Applying new recommendations..."
        cp "$DATA_DIR/new_recommendations.json" "$DATA_DIR/recommendations.json"
        echo "Recommendations updated successfully!"
        
        # If backend server is running, notify it
        if command -v curl &> /dev/null; then
            echo "Notifying backend server of update (if running)..."
            curl -s -X POST http://localhost:3001/api/admin/approve-recommendations -H "Content-Type: application/json" -d '{"approved":true}' || echo "Backend server not running or notification failed."
        fi
    else
        echo "Error: New recommendations file not found."
        exit 1
    fi
else
    echo "Error: Analysis script failed."
    exit 1
fi

echo "Manual update process completed."
echo "You can view the updated recommendations in the web application."
