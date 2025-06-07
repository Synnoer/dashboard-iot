# IoT Monitor — Setup Guide

## Prerequisites

Before running the project, make sure you have the following installed on your system:

- Node.js
Download and install from https://nodejs.org/
Recommended version: LTS (16.x or 18.x)

- Docker
Download and install from https://www.docker.com/products/docker-desktop
This is required to run the MongoDB database container.

## Setup

1. Clone the Repository
```sh
git clone https://github.com/Synnoer/dashboard-iot.git
cd dashboard-iot
``` 
Or
Download as ZIP then open cmd in the extracted folder

2. Install Node.js Dependencies
```sh
npm install
```

3. Start MongoDB with Docker
```sh
docker run -d --name iot-mongo -p 27017:27017 mongo
```

4. Set Environment Variables
```sh
cp .env.example .env
```

5. Run the Development Server
```sh
npm run dev
```
