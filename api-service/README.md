# Google Reviews API Service

This is a standalone Vercel serverless function that fetches Google Reviews for your business. Deploy this separately from your main website to enable Google Reviews on GitHub Pages.

## Prerequisites

1. A Vercel account (free tier works fine)
2. A Google Cloud Platform account with Places API enabled
3. A Google Places API key

## Setup Instructions

### Step 1: Get Your Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. (Recommended) Restrict your API key:
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Under "Application restrictions", you can restrict to specific domains

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the `api-service` directory:
   ```bash
   cd api-service
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy the service:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked "Set up and deploy?", choose **Yes**
   - When asked "Which scope?", select your account
   - When asked "Link to existing project?", choose **No**
   - When asked "What's your project's name?", enter something like `belldesigns-reviews-api`
   - When asked "In which directory is your code located?", enter `./`

5. Set the environment variable:
   ```bash
   vercel env add GOOGLE_PLACES_API_KEY
   ```
   - When prompted, paste your Google Places API key
   - Select "Production", "Preview", and "Development" environments

6. Redeploy to apply the environment variable:
   ```bash
   vercel --prod
   ```

7. **Copy your deployment URL** - it will look like:
   `https://belldesigns-reviews-api.vercel.app`

#### Option B: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository or upload the `api-service` folder
4. Configure the project:
   - Framework Preset: "Other"
   - Root Directory: `api-service`
5. Add environment variable:
   - Go to Project Settings > Environment Variables
   - Add `GOOGLE_PLACES_API_KEY` with your API key value
   - Select all environments (Production, Preview, Development)
6. Deploy
7. **Copy your deployment URL** from the deployment page

### Step 3: Update Your Main Website

1. Open `homeScript.js` in your main project
2. Find the `GOOGLE_CONFIG` object
3. Update the `apiEndpoint` with your Vercel deployment URL:
   ```javascript
   apiEndpoint: 'https://your-api-service.vercel.app/api/google-reviews'
   ```
   Replace `your-api-service` with your actual Vercel project name.

4. Commit and push to GitHub

## Testing

Test your API endpoint directly in a browser:
```
https://your-api-service.vercel.app/api/google-reviews?placeId=ChIJ000zA35C8kERssODF8atTl0
```

Replace:
- `your-api-service` with your Vercel project name
- `ChIJ000zA35C8kERssODF8atTl0` with your actual Place ID

You should see a JSON response with reviews data.

## Troubleshooting

### 404 Error
- Make sure you're using the correct Vercel URL
- Check that the deployment was successful in Vercel dashboard
- Verify the URL format: `https://project-name.vercel.app/api/google-reviews`

### "Missing placeId or API key" Error
- Check that `GOOGLE_PLACES_API_KEY` is set in Vercel environment variables
- Make sure you redeployed after adding the environment variable
- Verify the environment variable is set for all environments (Production, Preview, Development)

### "REQUEST_DENIED" or "INVALID_REQUEST" from Google
- Verify your Google Places API is enabled
- Check that your API key has Places API access
- Verify your Place ID is correct
- Check API key restrictions in Google Cloud Console

### No Reviews Returned
- Verify your Google Business Profile has reviews
- Check that the Place ID matches your business
- Some businesses may not have reviews available via the API

## Cost

- **Vercel**: Free tier includes 100GB bandwidth/month (more than enough for reviews API)
- **Google Places API**: 
  - First $200/month credit is free
  - Place Details requests cost $0.017 per request
  - With free credit, you get ~11,700 requests/month free
  - After that, it's very affordable for a small business website

## Security Notes

- Never commit your API key to Git
- Always use environment variables
- Consider restricting your API key to specific domains in Google Cloud Console
- Monitor your API usage in Google Cloud Console

## Support

For issues with:
- **Vercel deployment**: Check [Vercel Documentation](https://vercel.com/docs)
- **Google Places API**: Check [Google's Documentation](https://developers.google.com/maps/documentation/places/web-service)
- **Code issues**: Check browser console and Vercel function logs

