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

    // Directly compare the provided password with the stored password
    if (password === user.password) {
      // Generate a JWT token (optional)
      const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

      return res.status(200).json({ message: 'Sign in successful!', token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

