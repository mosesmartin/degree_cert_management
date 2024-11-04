const connection = require('../database/connection');
const path = require('path');
const fs = require('fs');

const uploadFile = async (req, res) => {
    try {
        const roll_no = req.params.roll_no;
        const { serial_num } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        const uploadedFile = req.files.file;

        if (!roll_no) {
            return res.status(400).json({ message: 'Roll number is required' });
        }

        // Query to fetch the existing file paths for the given roll number
        const rollNoQuery = 'SELECT file FROM studentrecords WHERE roll_no = ?';
        connection.query(rollNoQuery, [roll_no], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching roll number:', err ? err.message : 'No record found');
                return res.status(404).json({ error: 'Student record not found' });
            }

            // Get the existing file paths from the database
            let fileArray = [];
            if (results[0].file) {
                try {
                    fileArray = JSON.parse(results[0].file);
                    if (!Array.isArray(fileArray)) {
                        fileArray = [];
                    }
                } catch (parseError) {
                    console.error('Error parsing file paths:', parseError.message);
                    fileArray = [];
                }
            }

            // Define the upload directory and filename
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            const fileName = `${serial_num}_${roll_no}${path.extname(uploadedFile.name)}`;
            const relativeFilePath = path.join('uploads', fileName);

            uploadedFile.mv(path.join(uploadDir, fileName), (err) => {
                if (err) {
                    console.error('Error moving the file:', err.message);
                    return res.status(500).json({ error: 'Failed to save file on server', details: err.message });
                }

                // Add the new file path to the file array
                fileArray.push(relativeFilePath);

                // Update the database with the new file array in JSON format
                const sql = 'UPDATE studentrecords SET file = ? WHERE roll_no = ?';
                connection.query(sql, [JSON.stringify(fileArray), roll_no], (err, results) => {
                    if (err) {
                        console.error('Error updating record in database:', err.message);
                        return res.status(500).json({ error: 'Failed to update file details in database', details: err.message });
                    }

                    res.status(200).json({
                        message: 'File uploaded and saved successfully',
                        filePath: relativeFilePath,
                        data: results[0],
                        fileArray: fileArray,
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = uploadFile;
