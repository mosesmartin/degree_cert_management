// dbConnection.js

const mysql = require('mysql2');

// Create a connection pool (recommended for managing connections)
const connection = mysql.createConnection({
  host: '10.15.17.17',
  user: 'root',            // Your MySQL username
  password: 'mosar@2024', // Your MySQL password
  database: 'degreesdb'  // Your MySQL database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Export the connection object so other files can use it
module.exports = connection;







