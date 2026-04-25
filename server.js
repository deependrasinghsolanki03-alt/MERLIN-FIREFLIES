const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the current directory (CSS, Images, etc.)
app.use(express.static(__dirname));

// Serve the frontpage HTML on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontpage.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Node.js server is running! Open http://localhost:${port} in your browser.`);
});
