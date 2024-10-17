const connection = require('../database/connection');
const path = require('path');
const fs = require('fs');

// Function to uploadFile 
const uploadFile = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        const uploadedFile = req.files.file; // 'file' is the field name in the form
 // Read the file as binary data (buffer) if you need to store the file content as BLOB
 const fileBuffer = uploadedFile.name; // This holds the binary content of the file
        console.log("uploadedFile",uploadedFile)
   
        // Insert the file (binary data) into the database
        const sql = 'INSERT INTO studentrecords file VALUES (?)';

        // Execute the SQL query to save file information
        connection.query(sql, [fileBuffer], (err, result) => {
            if (err) {
                console.error('Error inserting record into database:', err.message);
                return res.status(500).json({ error: 'Failed to save file details in database', details: err.message });
            }

            res.status(200).json({ message: 'File uploaded and saved successfully', filePath });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


module.exports = uploadFile;
