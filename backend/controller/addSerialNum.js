const connection = require('../database/connection'); // Import database connection

// Function to handle updating the serial number and reason for a specific Roll_no
const editSerialNum = (req, res) => {
  const rollNo = req.params.roll_no; 
  const { serial_num, reason } = req.body; // Get serial_num and reason from request body
  console.log("serial num , reason", serial_num, reason);

  // Validate that rollNo is provided
  if (!rollNo) {
    return res.status(400).send({ message: "Roll_no is required" });
  }

  // Construct the update query dynamically based on which fields are provided
  const updates = [];
  const values = [];

  if (serial_num !== undefined) {
    updates.push("serial_num = ?");
    values.push(serial_num);
  }

  if (reason !== undefined) {
    updates.push("reason = ?");
    values.push(reason);
  }

  // If no fields to update, return an error
  if (updates.length === 0) {
    return res.status(400).send({ message: "At least one of serial_num or reason must be provided" });
  }

  // Add Roll_no to the values
  values.push(rollNo);

  // SQL query to update the record
  const updateQuery = `UPDATE studentrecords SET ${updates.join(", ")} WHERE Roll_no = ?`;

  // Execute the query to update the serial_num and reason
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error("Database error during update:", error);
      return res.status(500).send({ message: "Database error occurred" });
    }

    // Check if any record was updated
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
    }

    // Fetch the updated record
    const fetchQuery = `SELECT * FROM studentrecords WHERE Roll_no = ?`;
    connection.query(fetchQuery, [rollNo], (fetchError, fetchResults) => {
      if (fetchError) {
        console.error("Database error during fetch:", fetchError);
        return res.status(500).send({ message: "Database error occurred while fetching updated record" });
      }

      // Check if the updated record was found
      if (fetchResults.length === 0) {
        return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
      }

      // Send success response with the updated student record
      return res.status(200).send({
        message: `Update successful for Roll_no: ${rollNo}`,
        data: fetchResults[0], // Include the updated record data
      });
    });
  });
};

module.exports = editSerialNum; // Export the function
