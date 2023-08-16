import fetch from 'node-fetch';

export default async function handler(req, res) {
    try {
        // Get the dynamic path segments from the URL
        const dynamicPath = req.query.path[0];
        const apiUrl = `http://localhost:3002/${dynamicPath}`;
        const response = await fetch(apiUrl);

        if (response) {
            res.status(404).json({ error: 'Not Found' });
        } else {
            res.status(response.status).json({ error: 'An error occurred' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}