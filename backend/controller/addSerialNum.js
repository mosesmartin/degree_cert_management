const connection = require('../database/connection'); // Import database connection

// Function to handle updating the serial number and reason for a specific Roll_no
const editSerialNum = (req, res) => {
  const rollNo = req.params.roll_no; // Get the roll number from request parameters
  const { serial_num, reason } = req.body; // Get serial_num and reason from request body
  console.log("serial num, reason:", serial_num, reason);

  // Validate that rollNo is provided
  if (!rollNo) {
    return res.status(400).send({ message: "Roll_no is required" });
  }

  // Fetch existing serial_num and reasons from the database
  const fetchQuery = 'SELECT serial_num, reason FROM studentrecords WHERE roll_no = ?';
  connection.query(fetchQuery, [rollNo], (fetchError, fetchResults) => {
    if (fetchError) {
      console.error("Database error during fetch:", fetchError);
      return res.status(500).send({ message: "Database error occurred while fetching record" });
    }

    if (fetchResults.length === 0) {
      return res.status(404).send({ message: `No record found for roll_no: ${rollNo}` });
    }

    // Log the fetched serial_num and reason before parsing
    const fetchedSerialNum = fetchResults[0].serial_num;
    const fetchedReasons = fetchResults[0].reason;
    console.log("Fetched serial_num from database:", fetchedSerialNum);
    console.log("Fetched reasons from database:", fetchedReasons);

    // Parse the existing serial numbers and reasons, handling null values
    let serialNumbers = [];
    let reasons = [];

    if (fetchedSerialNum) {
      try {
        serialNumbers = Array.isArray(fetchedSerialNum) ? fetchedSerialNum : JSON.parse(fetchedSerialNum.replace(/'/g, '"').trim());
      } catch (error) {
        console.error("Error parsing serial_num:", error);
        return res.status(500).send({ message: "Invalid format for serial numbers." });
      }
    }

    if (fetchedReasons) {
      try {
        reasons = Array.isArray(fetchedReasons) ? fetchedReasons : JSON.parse(fetchedReasons.replace(/'/g, '"').trim());
      } catch (error) {
        console.warn("Error parsing reasons:", error);
        return res.status(500).send({ message: "Invalid format for reasons." });
      }
    }

    // Ensure both serialNumbers and reasons are arrays
    if (!Array.isArray(serialNumbers)) {
      serialNumbers = []; // Fallback to empty array if not an array
    }
    if (!Array.isArray(reasons)) {
      reasons = []; // Fallback to empty array if not an array
    }

    // Check for duplicate serial number
    if (serial_num) {
      if (serialNumbers.includes(serial_num)) {
        return res.status(400).send({ message: "Duplicate entry: Serial number already exists." });
      }
      serialNumbers.push(serial_num);
    }

    // Check for duplicate reason
    if (reason) {
      if (reasons.includes(reason)) {
        return res.status(400).send({ message: "Duplicate entry: Reason already exists." });
      }
      reasons.push(reason);
    }

    // Construct the update query
    const updates = ["serial_num = ?", "reason = ?"];
    const values = [JSON.stringify(serialNumbers), JSON.stringify(reasons)];

    values.push(rollNo);

    const updateQuery = `UPDATE studentrecords SET ${updates.join(", ")} WHERE roll_no = ?`;

    // Execute the query to update serial_num and reason
    connection.query(updateQuery, values, (error, results) => {
      if (error) {
        console.error("Database error during update:", error);
        return res.status(500).send({ message: "Database error occurred" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).send({ message: `No record found for roll_no: ${rollNo}` });
      }

      // Fetch the updated student record
      const fetchUpdatedQuery = 'SELECT * FROM studentrecords WHERE roll_no = ?';
      connection.query(fetchUpdatedQuery, [rollNo], (fetchUpdatedError, updatedResults) => {
        if (fetchUpdatedError) {
          console.error("Database error during fetch of updated record:", fetchUpdatedError);
          return res.status(500).send({ message: "Database error occurred while fetching updated record" });
        }

        // Ensure the updated record exists
        if (updatedResults.length === 0) {
          return res.status(404).send({ message: `No updated record found for roll_no: ${rollNo}` });
        }

        // Send success response with the updated student record
        return res.status(200).send({
          message: `Update successful for roll_no: ${rollNo}`,
          data: updatedResults[0], // Return the full student record
        });
      });
    });
  });
};

module.exports = editSerialNum; // Export the function
