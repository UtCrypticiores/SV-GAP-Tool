@echo off
setlocal enabledelayedexpansion

set envFile=.env

REM Check if .env file already exists
if not exist "!envFile!" (
  REM .env file does not exist

  :getPort
  REM Prompt user to enter a port number
  set /p port=Enter a four-digit port number: 

  REM Validate the port number
  REM Remove leading zeros from the entered port
  set "trimmedNumber=!port:~0,4!"
  set "trimmedNumber=!trimmedNumber:0=!"

  REM Check if the trimmed number is equal to an empty string
  if not "!trimmedNumber!"=="" (
    echo !port!| findstr /r "^[0-9][0-9][0-9][0-9]$" > nul
    if errorlevel 1 (
      echo !port! is an invalid port number. Please enter a four-digit number.
      goto getPort
    )
  )
  REM Create new .env file with the entered port
  echo PORT=!port!> "!envFile!"
)

npm start