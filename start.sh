#!/usr/bin/env bash
# ==============================================================================
# Hospital Management System (HMS) — Single-Command Full Stack Launcher
# Runs: Database Initializer -> Express REST API (Port 5000) -> Vite React (Port 5173)
# ==============================================================================

set -e

echo "🏥 Starting Hospital Management System (HMS)..."
echo "======================================================"

# Check if PostgreSQL service is running
if command -v pg_isready >/dev/null 2>&1; then
  if pg_isready -q 2>/dev/null; then
    echo "🗄️  PostgreSQL service detected: Online (port 5432)"
  else
    echo "ℹ️  PostgreSQL service is currently offline on port 5432."
    echo "   Using embedded persistent local database (server/db/hms_db.json)."
    echo "   (Optional: Run 'sudo systemctl start postgresql' to use PostgreSQL)"
  fi
fi

echo "🚀 Launching Database Initializer, Backend API, and Frontend..."
npm start
