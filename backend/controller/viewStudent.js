const connection = require('../database/connection');
const path = require('path');
const fs = require('fs');

const viewFile = async (req, res) => {
    try {
        const { roll_no } = req.params;

        if (!roll_no) {
            return res.status(400).json({ message: 'Roll number is required' });
        }

        const fileQuery = 'SELECT file FROM studentrecords WHERE roll_no = ?';
        connection.query(fileQuery, [roll_no], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching file paths:', err ? err.message : 'No record found');
                return res.status(404).json({ error: 'Student record not found' });
            }

            let fileArray;
            try {
                fileArray = JSON.parse(results[0].file);
                if (!Array.isArray(fileArray) || fileArray.length === 0) {
                    return res.status(404).json({ error: 'No files found for the specified roll number' });
                }
            } catch (parseError) {
                console.error('Error parsing file paths:', parseError.message);
                return res.status(500).json({ error: 'Invalid file data format' });
            }

            // Map relative paths to accessible URLs
            const validFilePaths = fileArray
                .filter(relativePath => fs.existsSync(path.join(__dirname, '../', relativePath)))
                .map(relativePath => `/uploads/${path.basename(relativePath)}`); // Return URL path for access

            if (validFilePaths.length === 0) {
                return res.status(404).json({ error: 'No files found on the server' });
            }

            res.json({ success: true, filePaths: validFilePaths });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = viewFile;
