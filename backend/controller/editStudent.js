const connection = require('../database/connection');

const editStudent = (req, res) => {
    const rollNo = req.params.roll_no;
    const { name, year, graduation_year, graduation_month, graduation_date } = req.body;
  
    console.log("Roll No:", rollNo);
    console.log("Request Body:", req.body);
  
    // Validate roll number and required fields
    if (!rollNo) {
      return res.status(400).json({ message: 'Invalid roll number' });
    }
  
    // Check for required fields in the request body
    if (!name || !year || !graduation_year || !graduation_month || !graduation_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const sql = `
      UPDATE studentrecords 
      SET name = ?, year = ?, graduation_year = ?, graduation_month = ?, graduation_date = ?
      WHERE roll_no = ?
    `;
  
    // Execute the SQL query
    connection.query(
      sql,
      [name, year, graduation_year, graduation_month, graduation_date, rollNo],
      (err, result) => {
        // Handle database errors
        if (err) {
          console.error("Error updating record:", err.message);
          return res.status(500).json({ error: 'Internal server error', details: err.message });
        }
  
        console.log("Update Result:", result); // Log the result of the query
  
        // Check if the update affected any rows
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
        }
  
        // Respond with success message
        res.status(200).json({ message: 'Student updated successfully' });
      }
    );
  };
  
  module.exports = editStudent; // Export the function for use in your routes
  