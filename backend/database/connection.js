// dbConnection.js

const mysql = require('mysql2');

// Create a connection pool (recommended for managing connections)
const connection = mysql.createConnection({
  host: 'localhost',
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







// const mysql = require('mysql2');

// // Create a connection pool (better for handling multiple connections)
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',            // Your MySQL username
//   password: process.env.DB_PASSWORD || 'mosar@2024', // Use environment variables for sensitive data
//   database: 'degreesdb',  // Your MySQL database name
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Promisify the connection for async/await use
// const connection = pool.promise();

// module.exports = connection;
