require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// API KEYS
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

app.get("/api/images", async (req, res) => {
    const query = req.query.query || "nature";

    try {
        const requests = [];

        // Unsplash API
        requests.push(
            axios.get(`https://api.unsplash.com/search/photos`, {
                params: { query, per_page: 40 },
                headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` },
            }).catch(() => null)
        );

        // Pexels API
        requests.push(
            axios.get(`https://api.pexels.com/v1/search`, {
                params: { query, per_page: 40 },
                headers: { Authorization: PEXELS_API_KEY },
            }).catch(() => null)
        );

        // Pixabay API
        requests.push(
            axios.get(`https://pixabay.com/api/`, {
                params: { key: PIXABAY_API_KEY, q: query, per_page: 50 },
            }).catch(() => null)
        );

        // Fetch all API responses
        const responses = await Promise.all(requests);

        // Format and merge all images
        const images = [
            ...(responses[0]?.data.results?.map(img => ({
                title: img.alt_description,
                url: img.urls.small,
                source: "Unsplash",
                link: img.links.html
            })) || []),

            ...(responses[1]?.data.photos?.map(img => ({
                title: img.photographer,
                url: img.src.medium,
                source: "Pexels",
                link: img.url
            })) || []),

            ...(responses[2]?.data.hits?.map(img => ({
                title: img.tags,
                url: img.webformatURL,
                source: "Pixabay",
                link: img.pageURL
            })) || [])
        ];

        res.json({ images });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
