// const connection = require('../connection'); // Adjust the path as necessary
// const bcrypt = require('bcrypt');

// // Function to handle sign-in
// exports.signIn =  (req, res) => {
//   const { email, password } = req.body;
//     if(!email || !password){
//         console.log('undefined')
//     }
//   // Query the database for the user
//   const sql = 'SELECT * FROM users WHERE email = ?';
//   connection.query(sql, [email], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (results.length > 0) {
//       const user = results[0];
//       // Compare the hashed password with the provided password
//       bcrypt.compare(password, user.password, (err, match) => {
//         if (err) {
//           return res.status(500).json({ error: err.message });

//         }
//         if (match) {
//           return res.status(200).json({ message: 'Sign in successful!' });
//         } else {
//           return res.status(401).json({ message: 'Invalid credentials' });
//         }
//       });
//     } else {
//       return res.status(404).json({ message: 'User not found' });
//     }
//   });
// };



const connection = require('../database/connection');
const jwt = require('jsonwebtoken'); // JWT for session management (optional)
const crypto = require('crypto')

// Function to handle sign-in
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Query the database for the user
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [results] = await connection.promise().query(sql, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Hash the provided password using SHA-256 and compare it with the stored hash
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword === user.password) {
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, 'FCC_DMS_@_2024', { expiresIn: '1h' });

      return res.status(200).json({ message: 'Sign in successful!', user: user, token: token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.getYears = async (req, res) => {
  try {
    const query = `SELECT DISTINCT year FROM studentrecords ORDER BY year DESC;`;

    // Use db to execute the query
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching years:", err);
        return res.status(500).json({ error: "Error fetching years" });
      }
      console.log('year results',results)

      // Send the fetched years back as JSON
      return res.status(200).json(results);
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  const { year } = req.query;
  console.log('year', year);

  try {
    const query = 'SELECT * FROM studentrecords WHERE year = ?';
    
    // Use db to execute the query with parameter
    connection.query(query, [year], (err, results) => {
      if (err) {
        console.error("Error fetching years:", err);
        return res.status(500).json({ error: "Error fetching years" });
      }
      console.log('year results', results);

      // Send the fetched years back as JSON
      return res.status(200).json(results);
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
