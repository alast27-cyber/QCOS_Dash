#!/bin/bash

# --- Autonomous GitHub Repository and Netlify Setup Script ---
# This script requires the GitHub CLI ('gh') to be installed and authenticated.
# Install 'gh' from: https://cli.github.com/

REPO_NAME="QCOS-Holographic-Dashboard"
NETLIFY_BUILD_COMMAND="npm run build"
NETLIFY_PUBLISH_DIR="dist" # Assuming a modern React/Vite/Create-React-App build process

echo "Initializing autonomous deployment workflow..."
echo "--------------------------------------------------------"

# 1. Check for GitHub CLI
if ! command -v gh &> /dev/null
then
    echo "Error: GitHub CLI (gh) could not be found."
    echo "Please install and authenticate 'gh' before running this script."
    exit 1
fi

# 2. Check for existing git repository
if [ ! -d .git ]; then
    echo "Initializing local git repository..."
    git init
fi

# 3. Create the remote repository on GitHub
echo "Creating remote repository: ${REPO_NAME}..."
# The '--public' flag is typical for dashboards deployed via Netlify
# The '--homepage' flag is optional but can set the initial description
CREATE_RESULT=$(gh repo create ${REPO_NAME} --public --description "QCOS Holographic Quantum System Dashboard - Built with React and Tailwind CSS." 2>&1)

if [ $? -ne 0 ]; then
    if echo "$CREATE_RESULT" | grep -q "already exists"; then
        echo "Warning: Repository ${REPO_NAME} already exists on GitHub. Skipping creation."
        REMOTE_URL=$(gh repo view ${REPO_NAME} --json url -q ".url")
    else
        echo "Error creating repository:"
        echo "$CREATE_RESULT"
        exit 1
    fi
else
    REMOTE_URL=$(echo "$CREATE_RESULT" | grep -o 'https://github.com/[^ ]*')
    echo "Success! Remote repository created at: ${REMOTE_URL}"
fi

# 4. Link local repository to the remote
if ! git remote get-url origin &> /dev/null; then
    echo "Adding remote 'origin' to local repository..."
    git remote add origin ${REMOTE_URL}
else
    echo "Remote 'origin' already exists. Verifying URL..."
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "${CURRENT_REMOTE}" != "${REMOTE_URL}" ]; then
        echo "Warning: Remote URL mismatch. Updating remote 'origin'."
        git remote set-url origin ${REMOTE_URL}
    fi
fi

# 5. Commit and push initial files (assumes user has project files ready)
echo "Preparing initial commit..."
git add .
git commit -m "feat: Initial commit of QCOS Holographic Dashboard code."

# Set the default branch to main (standard practice)
git branch -M main

echo "Pushing 'main' branch to GitHub..."
git push -u origin main

echo "--------------------------------------------------------"
echo "✅ Deployment Repository Setup Complete!"
echo "Next Steps for Netlify Deployment:"
echo "1. Visit the Netlify dashboard: https://app.netlify.com/start"
echo "2. Select 'Import an existing project from Git'."
echo "3. Connect to GitHub and select the new '${REPO_NAME}' repository."
echo "4. In the build settings, confirm or set:"
echo "   - Build Command: ${NETLIFY_BUILD_COMMAND}"
echo "   - Publish directory: ${NETLIFY_PUBLISH_DIR}"
echo "5. Click 'Deploy site'!"