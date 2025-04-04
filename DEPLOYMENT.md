# Backend Deployment Guide

This document provides instructions for deploying the backend server for the Indian Investment Advisor application to various free hosting services.

## Option 1: Railway

Railway offers a free tier that includes both web services and scheduled jobs, making it ideal for this application.

### Deployment Steps:

1. Create a Railway account at https://railway.app/
2. Install the Railway CLI: `npm i -g @railway/cli`
3. Login to Railway: `railway login`
4. Initialize the project: `railway init`
5. Deploy the project: `railway up`

The `railway.toml` file in this repository is already configured for deployment, including:
- The Node.js backend server
- A monthly scheduled job to update recommendations

## Option 2: Render

Render provides a reliable free tier for web services.

### Deployment Steps:

1. Create a Render account at https://render.com/
2. Connect your GitHub repository
3. Create a new Web Service
4. Select the repository and use the settings from the `render.yaml` file
5. Deploy the service

## Option 3: Heroku

Heroku offers a free tier with some limitations.

### Deployment Steps:

1. Create a Heroku account at https://heroku.com/
2. Install the Heroku CLI: `npm install -g heroku`
3. Login to Heroku: `heroku login`
4. Create a new app: `heroku create indian-investment-advisor-backend`
5. Deploy the app: `git push heroku main`

The `Procfile` in this repository is already configured for Heroku deployment.

## Environment Variables

All deployment options support setting environment variables. The following variables can be configured:

- `PORT`: The port on which the server will run (default: 3001)
- `NODE_ENV`: The environment (development/production)

## Connecting Frontend to Backend

After deploying the backend, update the frontend configuration to point to your backend URL:

1. Edit the `src/hooks/useRecommendations.ts` file
2. Update the `API_URL` constant with your backend URL
3. Redeploy the frontend

## Monitoring

All services provide monitoring and logging capabilities:

- Railway: `railway logs`
- Render: View logs in the Render dashboard
- Heroku: `heroku logs --tail`

## Troubleshooting

If you encounter issues with deployment:

1. Check the logs for error messages
2. Verify that all dependencies are correctly specified in package.json
3. Ensure the server is listening on the port provided by the hosting service
4. Check that the health check endpoint (/api/status) is responding correctly
