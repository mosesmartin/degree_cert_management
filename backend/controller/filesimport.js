// const connection = require('../database/connection');

// // API endpoint to import student records
// app.post('/api/import', (req, res) => {
//     const records = req.body; // Get records from the request body
  
//     const sql = 'INSERT INTO studentrecords SET ?';
  
//     records.forEach((record) => {
//       db.query(sql, record, (err, result) => {
//         if (err) {
//           return res.status(500).json({ error: err.message });
//         }
//       });
//     });
  
//     res.status(200).json({ message: 'Data imported successfully!' });
//   });

// importRecords.js
const connection = require('../database/connection'); // Adjust the path as necessary

// Function to import student records
const filesimport = (req, res) => {
  const records = req.body; // Get records from the request body
  
  const sql = 'INSERT INTO studentrecords SET ?';

  // Use a counter to track how many records have been processed
  let recordsProcessed = 0;

  records.forEach((record) => {
    connection.query(sql, record, (err, result) => {
      recordsProcessed++;
      if (err) {
        console.error("Error inserting record:", err.message);
        // If there's an error, send back the response immediately
        return res.status(500).json({ error: err.message });
      }

      // If all records have been processed without errors, send a success response
      if (recordsProcessed === records.length) {
        res.status(200).json({ message: `${recordsProcessed} records imported successfully.` });
      }
    });
  });
};

module.exports = filesimport;