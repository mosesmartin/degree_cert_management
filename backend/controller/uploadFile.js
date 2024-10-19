const connection = require('../database/connection');
const path = require('path');
const fs = require('fs');

// Function to uploadFile 
const uploadFile = async (req, res) => {
    try {
        // Extract the roll number from the URL parameter
        const roll_no = req.params.roll_no; // Assuming the route is defined to capture roll_no

        // Check if a file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        // Extract the uploaded file
        const uploadedFile = req.files.file; // 'file' is the field name in the form

        // Check if roll number is provided
        if (!roll_no) {
            return res.status(400).json({ message: 'Roll number is required' });
        }

        // Query to check if the roll number exists in the database
        const rollNoQuery = 'SELECT roll_no FROM studentrecords WHERE roll_no = ?';
        connection.query(rollNoQuery, [roll_no], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching roll number:', err ? err.message : 'No record found');
                return res.status(404).json({ error: 'Student record not found' });
            }

            const studentRollNo = results[0].roll_no; // Get the roll number from the result

            // Define the path where the file will be saved
            const uploadDir = path.join(__dirname, '../uploads'); // Ensure this directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            // Use roll number as the filename
            const fileName = `${studentRollNo}${path.extname(uploadedFile.name)}`; // Keep the original file extension
            const relativeFilePath = path.join('uploads', fileName); // Relative path to be stored in the database

            // Move the uploaded file to the desired location
            uploadedFile.mv(path.join(uploadDir, fileName), (err) => {
                if (err) {
                    console.error('Error moving the file:', err.message);
                    return res.status(500).json({ error: 'Failed to save file on server', details: err.message });
                }

                // Update the database with the relative file path
                const sql = 'UPDATE studentrecords SET file = ? WHERE roll_no = ?';
                connection.query(sql, [relativeFilePath, roll_no], (err) => {
                    if (err) {
                        console.error('Error updating record in database:', err.message);
                        return res.status(500).json({ error: 'Failed to update file details in database', details: err.message });
                    }

                    res.status(200).json({ message: 'File uploaded and saved successfully', filePath: relativeFilePath });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = uploadFile;
