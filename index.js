const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());  // Enable CORS for all routes

// Serve data from JSON file
app.get('/api/data', (req, res) => {
    const dataPath = path.join(__dirname, 'api', 'data.json');
    
    fs.readFile(dataPath, 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data' });
        }
        res.json(JSON.parse(jsonData));
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;
