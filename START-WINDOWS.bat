@echo off
setlocal
where node >nul 2>nul || (echo Install Node.js 18+ first: https://nodejs.org/ & pause & exit /b 1)
where npm >nul 2>nul || (echo npm was not found. Reinstall Node.js with npm enabled. & pause & exit /b 1)
echo This helper opens separate terminals for the API and frontend.
echo Make sure MongoDB is running and backend\.env has been created.
start "IMovies API" cmd /k "cd /d %~dp0backend && npm run dev"
start "IMovies Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000/api/health
pause
