// Netlify serverless function to fetch Google Reviews
// Place this file in /netlify/functions/google-reviews.js

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    const { placeId } = event.queryStringParameters || {};
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
                error: 'Missing placeId or API key. Set GOOGLE_PLACES_API_KEY in your Netlify environment variables.' 
            }),
        };
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data),
            };
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: data.error_message || 'Failed to fetch reviews' }),
            };
        }
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};

