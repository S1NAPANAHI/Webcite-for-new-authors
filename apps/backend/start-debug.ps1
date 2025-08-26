$ErrorActionPreference = "Stop"

# Set environment variables
$env:NODE_OPTIONS = "--trace-warnings"
$env:DEBUG = "*"

# Start the server with detailed logging
Write-Host "🚀 Starting server in debug mode..." -ForegroundColor Cyan
node --trace-warnings server.js 2>&1 | Tee-Object -FilePath "./server-debug.log" -Append

Write-Host "\n📝 Server logs have been saved to server-debug.log" -ForegroundColor Green
