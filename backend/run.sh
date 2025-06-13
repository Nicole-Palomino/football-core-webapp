#!/bin/bash

# Navigate to the app directory (if not already there)
# As main.py is now in the root, we run uvicorn from the root.
# Make sure your current directory is the project root when running this.

# Set PYTHONPATH to include the 'app' directory
# This helps Python find modules like 'app.crud', 'app.schemas', etc.
export PYTHONPATH=$(pwd)/app:$PYTHONPATH

# Run the FastAPI application with Uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000