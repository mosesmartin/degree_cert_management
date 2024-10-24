const connection = require('../database/connection'); // Import database connection

// Function to handle incrementing the count for a specific Roll_no
const printcount = (req, res) => {
  const rollNo = req.params.roll_no; // Get Roll_no from request parameters
  
  // Validate that rollNo is provided
  if (!rollNo) {
    return res.status(400).send({ message: "Roll_no is required" }); 
  }

  // SQL query to get the current count for the specified roll_no
  const getCountQuery = `SELECT count FROM studentrecords WHERE Roll_no = ?`;

  // Execute the query to get the current count
  connection.query(getCountQuery, [rollNo], (error, results) => {
    if (error) {
      console.error("Database error while fetching count:", error);
      return res.status(500).send({ message: "Database error occurred" });
    }

    // Check if any record was found
    if (results.length === 0) {
      return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
    }

    // Log the current count to the console
    const currentCount = results[0].count;
    console.log(`Current count for Roll_no ${rollNo}:`, currentCount);

    // SQL query to increment the count for the specific roll_no
    const updateQuery = `UPDATE studentrecords SET count = count + 1 WHERE Roll_no = ?`;

    // Execute the query to increment the count
    connection.query(updateQuery, [rollNo], (error, results) => {
      if (error) {
        console.error("Database error during update:", error);
        return res.status(500).send({ message: "Database error occurred" });
      }

      // Check if any record was updated
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: `No record found for Roll_no: ${rollNo}` });
      }

       // After updating, fetch the updated record to send back the full object
       connection.query(getCountQuery, [rollNo], (error, updatedResults) => {
        if (error) {
          console.error("Database error while fetching updated student record:", error);
          return res.status(500).send({ message: "Database error occurred" });
        }

        // Send success response with the updated student record
        return res.status(200).send({ 
          message: `Count incremented successfully for Roll_no: ${rollNo}`, 
          data: updatedResults[0]  // Send the full updated student record
        });
      });
      // Log the new count after incrementing
      console.log(`New count for Roll_no ${rollNo}:`, currentCount + 1);
      console.log(`student record:`, results);

      // Send success response
    //   return res.status(200).send({ message: `Count incremented successfully for Roll_no: ${rollNo}` ,data:results[0] });
    });
  });
};

module.exports = printcount; // Export the function
