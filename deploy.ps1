# Deploy script for live updates
Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Add all changes
git add .

# Get commit message from user or use default
$commitMessage = Read-Host "Enter commit message (or press Enter for 'Update website')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update website"
}

# Commit changes
git commit -m $commitMessage

# Push to GitHub (this will trigger the GitHub Actions workflow)
git push origin feature/enhanced-website

Write-Host "✅ Changes pushed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Your website will be updated automatically via GitHub Pages" -ForegroundColor Cyan
Write-Host "📊 Check deployment status at: https://github.com/seththo/seththomassen.com/actions" -ForegroundColor Yellow 