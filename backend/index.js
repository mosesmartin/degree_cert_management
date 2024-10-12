const express = require('express');
const app = express();
const db = require('./database/connection'); // Import the DB connection
const cors = require('cors');
const { signIn } = require('./controller/signin');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // Built-in middleware for parsing JSON
app.use(express.urlencoded({ extended: true })); // Built-in middleware for parsing URL-encoded data
app.use(cors());

// API endpoint for user sign-in
app.post('/api/signin', signIn); // Corrected route

// Define a port for the server
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server with MySQL connection!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});