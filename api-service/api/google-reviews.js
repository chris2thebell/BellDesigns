// Serverless function to fetch Google Reviews
// Deploy this to Vercel as a standalone API service

export default async function handler(req, res) {
    // Set CORS headers to allow requests from your GitHub Pages site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { placeId } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId || !apiKey) {
        return res.status(400).json({ 
            error: 'Missing placeId or API key. Set GOOGLE_PLACES_API_KEY in your environment variables.' 
        });
    }

    try {
        // Request additional fields to ensure we get reviews
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,formatted_address&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            // Check if reviews exist and are not empty
            if (!data.result.reviews || data.result.reviews.length === 0) {
                return res.status(200).json({ 
                    status: 'OK', 
                    result: { 
                        ...data.result, 
                        reviews: [],
                        message: 'No reviews available for this place'
                    } 
                });
            }
            return res.status(200).json(data);
        } else {
            return res.status(400).json({ 
                status: data.status,
                error: data.error_message || 'Failed to fetch reviews' 
            });
        }
    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

