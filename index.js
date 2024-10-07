const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());  // Enable CORS for all routes

// Helper function to serve JSON data
const serveJsonFile = (filePath, res) => {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return res.status(500).json({ error: 'Error reading data' });
        }

        try {
            const parsedData = JSON.parse(jsonData);
            res.json(parsedData);
        } catch (parseError) {
            console.error(`Error parsing JSON data from ${filePath}:`, parseError);
            return res.status(500).json({ error: 'Error parsing data' });
        }
    });
};

// Route for data.json with pagination
app.get('/api/data', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'data.json');
    const page = parseInt(req.query.page) || 1;  // Get the page number from query, default to 1
    const pageSize = 20;  // Number of items per page

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error(`Error reading data.json:`, err);
            return res.status(500).json({ error: 'Error reading data' });
        }

        let data;
        try {
            data = JSON.parse(jsonData);
        } catch (parseError) {
            console.error(`Error parsing data.json:`, parseError);
            return res.status(500).json({ error: 'Error parsing data' });
        }

        const totalResults = data.results.length;
        const totalPages = Math.ceil(totalResults / pageSize);
        const hasNextPage = page < totalPages;

        // Slice the results for the current page
        const paginatedResults = data.results.slice((page - 1) * pageSize, page * pageSize);

        // Respond with paginated data
        res.json({
            currentPage: page,
            hasNextPage: hasNextPage,
            totalPages: totalPages,
            results: paginatedResults,
        });
    });
});

// Route for info.json
app.get('/api/info/:animeId', (req, res) => {
    const animeId = req.params.animeId; // Get the anime ID directly
    const filePath = path.join(process.cwd(), 'api', 'info.json'); 

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error(`Error reading info.json:`, err);
            return res.status(500).json({ error: 'Error reading info data' });
        }

        let data;
        try {
            data = JSON.parse(jsonData);
        } catch (parseError) {
            console.error(`Error parsing info.json:`, parseError);
            return res.status(500).json({ error: 'Error parsing info data' });
        }

        // Find the anime info based on the animeId
        const animeInfo = data.find(anime => anime.id === animeId);
        
        if (animeInfo) {
            res.json(animeInfo);
        } else {
            res.status(404).json({ error: 'Anime not found' });
        }
    });
});

// Route for stream.json
app.get('/api/stream/:animeEpisode', (req, res) => {
    const { animeEpisode } = req.params;
    const [animeName, episode] = animeEpisode.split('-'); // Split the combined parameter into anime name and episode
    const filePath = path.join(process.cwd(), 'api', 'stream.json'); 

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            console.error(`Error reading stream.json:`, err);
            return res.status(500).json({ error: 'Error reading stream data' });
        }

        let data;
        try {
            data = JSON.parse(jsonData);
        } catch (parseError) {
            console.error(`Error parsing stream.json:`, parseError);
            return res.status(500).json({ error: 'Error parsing stream data' });
        }

        // If episode is specified, return the specific episode link
        if (episode) {
            const streamData = data.find(item => item.id === animeName && item.episode === episode);
            
            if (streamData) {
                res.json({ url: streamData.url });
            } else {
                res.status(404).json({ error: 'Episode not found' });
            }
        } else {
            // If no episode is specified, return all episodes for the anime
            const allEpisodes = data.filter(item => item.id === animeName);
            if (allEpisodes.length > 0) {
                res.json(allEpisodes);
            } else {
                res.status(404).json({ error: 'Anime not found' });
            }
        }
    });
});


// Route for watch.json
app.get('/api/watch', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'watch.json'); 
    serveJsonFile(filePath, res);
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;
