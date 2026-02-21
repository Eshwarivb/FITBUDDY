@echo off
echo Starting FitBuddy AI Coach...
start cmd /k "cd backend && python main.py"
start cmd /k "cd frontend && npm run dev"
echo Servers are starting. Open http://localhost:5173 for the frontend.
echo Make sure you have set your GEMINI_API_KEY in backend/.env
