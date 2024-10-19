const connection = require('../database/connection');
const path = require('path');
const fs = require('fs');

// Function to viewFile 
const viewFile = async (req, res) => {
    try {
        // Extract roll number from the request parameters or body
        const { roll_no } = req.params; // Assuming roll_no is passed as a URL parameter

        if (!roll_no) {
            return res.status(400).json({ message: 'Roll number is required' });
        }

        // Query to get the file path from the database based on roll number
        const fileQuery = 'SELECT file FROM studentrecords WHERE roll_no = ?';
        connection.query(fileQuery, [roll_no], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching file path:', err ? err.message : 'No record found');
                return res.status(404).json({ error: 'Student record not found' });
            }

            const filePath = results[0].file; // Get the file path from the result

            // Check if the file exists
            const absoluteFilePath = path.join(__dirname, '../', filePath); // Construct the absolute path

            if (!fs.existsSync(absoluteFilePath)) {
                return res.status(404).json({ error: 'File not found on the server' });
            }

            // Serve the file as a response
            res.sendFile(absoluteFilePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err.message);
                    res.status(500).json({ error: 'Failed to send file', details: err.message });
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = viewFile;
