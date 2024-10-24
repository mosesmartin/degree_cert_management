const connection = require('../database/connection');
const crypto = require('crypto'); // Import crypto for hashing

const password = (req, res) => {
  const { enteredPassword,roll_no } = req.body; // Get roll_no and entered password from request body
  console.error("enteredPassword:", enteredPassword);

  // Validate that roll_no and enteredPassword are provided
  if ( !enteredPassword) {
    return res.status(400).send({ message: " password are required." });
  }

  // Hash the entered password using SHA-256
  const hashedPassword = crypto.createHash('sha256').update(enteredPassword).digest('hex');

  // SQL query to get the passkey for the specified roll_no
  const getPasskeyQuery = `SELECT passkey FROM studentrecords WHERE Roll_no = ?`;

  // Execute the query to get the passkey
  connection.query(getPasskeyQuery, [roll_no], (error, results) => {
    if (error) {
      console.error("Database error while fetching passkey:", error);
      return res.status(500).send({ message: "Database error occurred" });
    }

    // Check if any record was found
    if (results.length === 0) {
      return res.status(404).send({ message: `No record found for Roll_no: ${roll_no}` });
    }

    // Compare the hashed entered password with the stored passkey
    const storedPasskey = results[0].passkey;
    if (hashedPassword === storedPasskey) {
      // Password matches
      return res.status(200).send({ message: "Password is correct." });
    } else {
      // Password does not match
      return res.status(403).send({ message: "Invalid password." });
    }
  });
};

module.exports = password; // Export the function for use in your routes
