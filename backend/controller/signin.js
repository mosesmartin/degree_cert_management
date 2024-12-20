
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Function to handle sign-in
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Query the database for the user
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [results] = await connection.promise().query(sql, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Hash the provided password using SHA-256 and compare it with the stored hash
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedPassword === user.password) {
      // Generate a JWT token with user role included
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.user_role },
        'FCC_DMS_@_2024',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Sign in successful!',
        user: { id: user.id, email: user.email, role: user.user_role },
        token: token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

};



// Function to handle adding a new user
exports.addUser = async (req, res) => {
  const { email, password, user_role } = req.body;

  if (!email || !password || !user_role) {
    return res.status(400).json({ message: 'Email, password, and user role are required' });
  }

  try {
    // Hash the password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // SQL query to insert a new user
    const sql = 'INSERT INTO users (email, password, user_role) VALUES (?, ?, ?)';
    const values = [email, hashedPassword, user_role];

    // Execute the SQL query
    const [result] = await connection.promise().query(sql, values);

    return res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.getYears = async (req, res) => {
  try {
    const query = `SELECT DISTINCT year FROM studentrecords ORDER BY year DESC;`;

    // Use db to execute the query
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching years:", err);
        return res.status(500).json({ error: "Error fetching years" });
      }
      console.log('year results',results)

      // Send the fetched years back as JSON
      return res.status(200).json(results);
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  const { year, limit = 10, offset = 0, search } = req.query;

  try {
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: "Invalid limit or offset values" });
    }

    let query = `
      SELECT * 
      FROM studentrecords 
      WHERE year = ?
    `;
    
    const params = [year];

    if (search) {
      query += ` AND (name LIKE ? OR roll_no LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      console.log("Search term:", searchTerm);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parsedLimit, parsedOffset);
    
    console.log("Executing query:", query, params);

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching student records:", err);
        return res.status(500).json({ error: "Error fetching student records" });
      }

      console.log(`Fetched ${results.length} student records for year: ${year}`);
      console.log("Offset:", parsedOffset, "Limit:", parsedLimit);

      return res.status(200).json(results);
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getStudentProgram = async (req, res) => {
  const { program, limit = 10, offset = 0, search } = req.query;

  try {
    if (!program) {
      return res.status(400).json({ error: "program is required" });
    }

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: "Invalid limit or offset values" });
    }

    let query = `
      SELECT * 
      FROM studentrecords 
      WHERE program = ?
    `;
    
    const params = [program];

    if (search) {
      query += ` AND (name LIKE ? OR roll_no LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      console.log("Search term:", searchTerm);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parsedLimit, parsedOffset);
    
    console.log("Executing query:", query, params);

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching student records:", err);
        return res.status(500).json({ error: "Error fetching student records" });
      }

      console.log(`Fetched ${results.length} student records for program: ${program}`);
      console.log("Offset:", parsedOffset, "Limit:", parsedLimit);

      return res.status(200).json(results);
    });
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};