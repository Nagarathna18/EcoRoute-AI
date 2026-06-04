@echo off
echo ============================================
echo   Smart Waste Collection System
echo   Starting both backend and frontend...
echo ============================================
echo.

echo Starting Flask backend on port 5000...
start "Flask Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak >nul

echo Starting React frontend on port 5173...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ============================================
echo.
pause
