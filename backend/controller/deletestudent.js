const connection = require('../database/connection');

// Function to delete a student record by roll number using callbacks
const deleteStudent = (req, res) => {
  const rollNo = req.params.roll_no;

  // Validate roll number
  if (!rollNo) {
    return res.status(400).json({ message: 'Invalid roll number' });
  }

  const sql = 'DELETE FROM studentrecords WHERE roll_no = ?';

  // Execute the query using a callback
  connection.query(sql, [rollNo], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err.message);
      // console.error("Full error details:", err);
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  });
};

module.exports = deleteStudent;
