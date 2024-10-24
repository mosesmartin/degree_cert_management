const connection = require('../database/connection'); // Import database connection

// Function to get a student record by roll number
const countPasskey = (req, res) => {
  const rollNo = req.params.roll_no; // Get Roll_no from request parameters

  // Validate that rollNo is provided
  if (!rollNo) {
    return res.status(400).send({ message: "Roll_no is required" });
  }

  // SQL query to fetch the student record for the specified roll_no
  const getStudentQuery = `SELECT * FROM studentrecords WHERE Roll_no = ?`;

  // Execute the query to get the student record
  connection.query(getStudentQuery, [rollNo], (error, results) => {
    if (error) {
      console.error("Database error while fetching student record:", error);
      return res.status(500).send({ message: "Database error occurred" });
    }

    // Check if any record was found
    if (results.length === 0) {
      return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
    }

    // Check if the count is greater than or equal to 1
    const currentCount = results[0].count; // Assuming count is in the fetched record
    if (currentCount >= 1) {
      return res.status(403).send({ message: "Enter passkey." });
    }

    // Send the student record as a response
    return res.status(200).send({ student: results[0] });
  });
};

module.exports = countPasskey; // Export the function
