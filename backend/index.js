const express = require('express');
const app = express();
const db = require('./database/connection'); // Import the DB connection
const cors = require('cors');
const { signIn, getYears, getStudents } = require('./controller/signin');
const filesimport = require('./controller/filesimport');
const deleteStudent = require('./controller/deletestudent');
const editStudent = require('./controller/editStudent');
const uploadFile = require('./controller/uploadFile');
const fileUpload = require('express-fileupload');
const viewFile = require('./controller/viewStudent');

// Increase the payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable files upload
app.use(fileUpload({
  createParentPath: true
}));
// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // Built-in middleware for parsing JSON
// app.use(express.urlencoded({ extended: true })); // Built-in middleware for parsing URL-encoded data
app.use(cors());

// API endpoint for user sign-in
app.post('/api/signin', signIn);
app.post('/api/import', filesimport);

// API endpoints for getting years and students
app.get('/api/years', getYears);
app.get('/api/getYear', getStudents);

// View file route
app.get('/api/view/:roll_no', viewFile); // Set up the route to view the file

// API endpoint for deleting a student
app.delete('/api/deleteStudent/:roll_no', deleteStudent);

// API endpoint for updating a student
app.put('/api/updateStudent/:roll_no', editStudent); // Corrected route to include '/api/'


app.post('/api/upload/:roll_no', uploadFile); 

// Define a port for the server
const PORT = 8000;

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server with MySQL connection!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
