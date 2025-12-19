<#
.SYNOPSIS
    Deploys the Holographic Dashboard application.
    This script is designed to run on Windows PowerShell.
.DESCRIPTION
    This script performs the following actions:
    1. Installs Node.js dependencies (npm install).
    2. Builds the React application for production (npm run build).
    3. Simulates a final deployment step (e.g., uploading to a gateway/server).
.NOTES
    Requires Node.js and npm to be installed and available in the system's PATH.
#>

# Set execution policy to allow local scripts to run if it's currently restricted (temporarily)
# This is often required for the first run of a PowerShell script.
$currentExecutionPolicy = Get-ExecutionPolicy
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "--- Holographic Dashboard Deployment Script ---" -ForegroundColor Cyan

# 1. Install Dependencies
Write-Host "`n[STEP 1/3] Installing Node.js dependencies (npm install)..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE."
    }
    Write-Host "`nDependencies installed successfully." -ForegroundColor Green
} catch {
    Write-Error "ERROR: Failed to install dependencies. Is Node.js installed? $($_.Exception.Message)"
    exit 1
}

# 2. Build Application
Write-Host "`n[STEP 2/3] Building the React application (npm run build)..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed with exit code $LASTEXITCODE."
    }
    Write-Host "`nBuild completed successfully. Output is in the 'dist' or 'build' folder." -ForegroundColor Green
} catch {
    Write-Error "ERROR: Failed to build the application. Check your package.json scripts. $($_.Exception.Message)"
    exit 1
}

# 3. Simulated Deployment Step
Write-Host "`n[STEP 3/3] Simulating deployment to Quantum-to-Web Gateway..." -ForegroundColor Yellow
# In a real scenario, you would add commands here to upload the 'dist' folder content
# to your hosting service (e.g., Firebase, Azure Static Web Apps, custom server API).
Start-Sleep -Seconds 3 # Simulate network delay/processing
Write-Host "`nDeployment simulation complete. The application is now ready for serving from the build artifacts." -ForegroundColor Green

Write-Host "`n--- Deployment Process Finished ---" -ForegroundColor Cyan

# Reset execution policy (optional, but good practice)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy $currentExecutionPolicy -Force