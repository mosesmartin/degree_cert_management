const connection = require('../connection'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

// Function to handle sign-in
exports.signIn = (req, res) => {
  const { email, password } = req.body;

  // Query the database for the user
  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      const user = results[0];
      // Compare the hashed password with the provided password
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (match) {
          return res.status(200).json({ message: 'Sign in successful!' });
        } else {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
};