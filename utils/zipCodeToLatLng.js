import axios from 'axios';
import { createToast } from './toast';
// import fetch from 'node-fetch';

export default async function zipCodeToLatLng(zipCode) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;

    try {
        const {data} = await axios.get(url);
        if (data.results?.length > 0) {
            const location = data.results[0].geometry.location;
            const latitude = location.lat;
            const longitude = location.lng;
            return { latitude, longitude };
        } else {
            createToast('Invalid zip code');
        }
    } catch (error) {
        console.error(error);
    }
}