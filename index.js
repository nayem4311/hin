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
            return res.status(500).json({ error: 'Error reading data' });
        }
        res.json(JSON.parse(jsonData));
    });
};

// Route for data.json with pagination
app.get('/api/data', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'data.json'); // Updated path reference
    const page = parseInt(req.query.page) || 1;  // Get the page number from query, default to 1
    const pageSize = 20;  // Number of items per page

    serveJsonFile(filePath, (data) => {
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
app.get('/api/info', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'info.json'); // Updated path reference
    serveJsonFile(filePath, res);
});

// Route for stream.json with episode retrieval
app.get('/api/stream/:animeName/:episode', (req, res) => {
    const { animeName, episode } = req.params;
    const filePath = path.join(process.cwd(), 'api', 'stream.json'); // Updated path reference

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading stream data' });
        }

        const data = JSON.parse(jsonData);
        
        // Find the streaming link for the specific anime and episode
        const streamData = data.find(item => item.id === animeName && item.episode === episode);
        
        if (streamData) {
            res.json({ url: streamData.url });
        } else {
            res.status(404).json({ error: 'Episode not found' });
        }
    });
});

// Route for watch.json
app.get('/api/watch', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'watch.json'); // Updated path reference
    serveJsonFile(filePath, res);
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Helper function to serve JSON data with callback
const serveJsonFileWithCallback = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) {
            return { error: 'Error reading data' };
        }
        const data = JSON.parse(jsonData);
        callback(data);
    });
};

module.exports = app;
