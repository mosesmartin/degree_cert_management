const connection = require('../database/connection'); // Import database connection

// Function to handle updating the serial number for a specific Roll_no
const editSerialNum = (req, res) => {
  const rollNo = req.params.roll_no; 
  console.log("rollNo", rollNo);
  
  // Get Roll_no from request parameters
  const { serial_num } = req.body; // Get serial_num from request body
  console.log("serial num", serial_num);

  // Validate that rollNo and serial_num are provided
  if (!rollNo || !serial_num) {
    return res.status(400).send({ message: "Roll_no and serial_num are required" });
  }

  // SQL query to update the serial_num for the specific roll_no
  const updateQuery = `UPDATE studentrecords SET serial_num = ? WHERE Roll_no = ?`;

  // Execute the query to update the serial_num
  connection.query(updateQuery, [serial_num, rollNo], (error, results) => {
    if (error) {
      console.error("Database error during update:", error);
      return res.status(500).send({ message: "Database error occurred" });
    }

    // Check if any record was updated
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
    }

    // SQL query to fetch the updated record
    const fetchQuery = `SELECT * FROM studentrecords WHERE Roll_no = ?`;
    connection.query(fetchQuery, [rollNo], (fetchError, fetchResults) => {
      if (fetchError) {
        console.error("Database error during fetch:", fetchError);
        return res.status(500).send({ message: "Database error occurred while fetching updated record" });
      }

      // Check if the record was found
      if (fetchResults.length === 0) {
        return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
      }

      // Send success response with the updated student record
      return res.status(200).send({
        message: `Serial number updated successfully for Roll_no: ${rollNo}`,
        data: fetchResults[0], // Include the updated record data
      });
    });
  });
};

module.exports = editSerialNum; // Export the function
