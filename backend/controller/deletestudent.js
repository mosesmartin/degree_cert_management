const connection = require('../database/connection'); // Adjust the path as necessary

// Function to delete a student record by roll number
const deleteStudent = (req, res) => {
  const rollNo = req.params.roll_no; // Get roll number from request parameters
  Console.log(rollNo)
  // SQL query to delete a student record where roll_no matches
  const sql = 'DELETE FROM studentrecords WHERE roll_no = ?';

  connection.query(sql, [rollNo], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Check if any record was deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  });
};

module.exports = deleteStudent;
