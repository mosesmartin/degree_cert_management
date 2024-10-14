

import React, { useState } from 'react';
import '../pages/Signin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_BASE_URL } from '../ApiConfig';

const date = new Date();

export const Signin = () => {
  const [email, setEmail] = useState('');       // State for email
  const [password, setPassword] = useState(''); // State for password
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const payload = { email, password };
    
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, payload);
      console.log('response', response);
      if (response.status === 200) {
        // alert("Login successful");
        navigate('/mainpage'); // Redirect to the main page after successful login
      }
    } catch (error) {
      console.log('error', error);
      setErrorMessage('Login failed. Please check your credentials.'); // Set error message
    }
  };

  return (
    <div>
      <form className="form-signin" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
          autoFocus
        />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Show error message */}
        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        <p className="mt-5 mb-0 text-muted">&copy; {date.getFullYear()}</p>
        <p className="mb-3 text-muted">- Information Technology Services</p>
      </form>
    </div>
  );
};
