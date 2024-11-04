const express = require('express');
const path = require('path'); // Ensure path is imported
const app = express();
const db = require('./database/connection');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const {
  signIn, getYears, getStudents, getStudentProgram,
  addUser
} = require('./controller/signin');
const filesimport = require('./controller/filesimport');
const deleteStudent = require('./controller/deletestudent');
const editStudent = require('./controller/editStudent');
const uploadFile = require('./controller/uploadFile');
const viewFile = require('./controller/viewStudent');
const printcount = require('./controller/printcount');
const countPasskey = require('./controller/countPasskey');
const password = require('./controller/password');
const editSerialNum = require('./controller/addSerialNum');
const ipAddress = require('./controller/ipAddress');

// Enable CORS
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable file upload
app.use(fileUpload({
  createParentPath: true
}));

// API endpoints
app.post('/api/signin', signIn);
app.post('/api/adduser', addUser);
app.post('/api/import', filesimport);
app.get('/api/years', getYears);
app.get('/api/getYear', getStudents);
app.get('/api/getProgram', getStudentProgram);
app.get('/api/view/:roll_no', viewFile);
app.get('/api/student/:roll_no', countPasskey);
app.post('/api/password', password);
app.delete('/api/deleteStudent/:roll_no', deleteStudent);
app.put('/api/updateStudent/:roll_no', editStudent);
app.post('/api/upload/:roll_no', uploadFile);
app.put('/api/increment/:roll_no', printcount);
app.put('/api/serialnum/:roll_no', editSerialNum);
app.get('/api/validate-ip', ipAddress);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server with MySQL connection!');
});

// 404 error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
