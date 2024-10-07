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

// Route for data.json
app.get('/api/data', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'data.json'); // Updated path reference
    serveJsonFile(filePath, res);
});

// Route for info.json
app.get('/api/info', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'info.json'); // Updated path reference
    serveJsonFile(filePath, res);
});

// Route for stream.json
app.get('/api/stream', (req, res) => {
    const filePath = path.join(process.cwd(), 'api', 'stream.json'); // Updated path reference
    serveJsonFile(filePath, res);
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

module.exports = app;
