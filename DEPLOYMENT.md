# Logistics Dashboard Deployment Guide

This document provides instructions for deploying the Logistics Dashboard application both locally and in production environments.

## Local Development Setup

### Prerequisites

- Node.js v18.0.0 or later
- npm v9.0.0 or later

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logistics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the application in development mode, with hot-reloading enabled.
   
4. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`
   - The dashboard should be visible with all mock data loaded

## Production Deployment

### Option 1: Deploying on Replit

1. **Fork this Replit project**
   - Click the "Fork" button to create your own copy of the project

2. **Deploy using Replit Deployments**
   - Click on the "Deploy" tab in the Replit interface
   - Click "Deploy to Replit"
   - Follow the on-screen prompts to complete deployment

3. **Access your deployed application**
   - Once deployed, you'll receive a URL where your application is accessible
   - The URL will be in the format `https://your-project-name.your-username.repl.co`

### Option 2: Deploying to a VPS or Cloud Provider

1. **Build the application**
   ```bash
   npm run build
   ```
   This will create optimized production files in the `dist` directory.

2. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=production
   PORT=8080
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

4. **Set up a reverse proxy (optional but recommended)**
   - Configure Nginx or Apache to serve the application
   - Set up SSL certificates for HTTPS support

## Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t logistics-dashboard .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:5000 -d logistics-dashboard
   ```

3. **Access the application**
   - Navigate to `http://localhost:8080` in your browser

## Deployment Considerations

### Performance Optimization
- The application uses client-side rendering with React
- Consider implementing server-side rendering for improved initial load times
- Enable gzip compression in your web server configuration

### Security Considerations
- Implement proper authentication before using in production
- Set up CORS policies to restrict access
- Configure CSP (Content Security Policy) headers

### Monitoring and Maintenance
- Set up application monitoring using services like New Relic or Datadog
- Implement logging for debugging and auditing purposes
- Create a backup strategy for any persistent data

## Troubleshooting

### Common Issues

1. **Application doesn't start**
   - Check if the correct Node.js version is installed
   - Verify all dependencies are installed with `npm install`
   - Check for port conflicts

2. **Blank screen with no errors**
   - Open browser developer tools to check for console errors
   - Verify that the API endpoints are accessible

3. **Styling issues**
   - Clear browser cache
   - Ensure Tailwind CSS is properly configured

For additional support, please refer to the project documentation or contact the development team.