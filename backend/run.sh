#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Starting backend on http://127.0.0.1:8000"
echo "Open http://127.0.0.1:8000/health to check if running."
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
