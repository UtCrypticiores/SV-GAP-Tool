#!/bin/bash

envFile=".env"

# Check if .env file already exists
if [ ! -f "$envFile" ]; then
  # .env file does not exist

  # Prompt user to enter a port number
  read -p "Enter a four-digit port number: " port

  # Validate the port number
  # Remove leading zeros from the entered port
  trimmedNumber=$(echo "$port" | sed 's/^0*//')

  # Check if the trimmed number is equal to an empty string
  if [ "$trimmedNumber"  == "0" ]; then
    if [[ "$port" =~ ^[0-9]{4}$ ]]; then
      # Create new .env file with the entered port
      echo "PORT=$port" > "$envFile"
    else
      echo "$port is an invalid port number. Please enter a four-digit number."
      exit 1
    fi
  fi
fi

# Start the Node.js application
npm start