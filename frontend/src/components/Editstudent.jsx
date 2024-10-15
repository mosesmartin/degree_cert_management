import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig'; // Adjust your API URL import

const EditStudentForm = ({ rollNo, currentStudent, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    name: currentStudent?.name || '',
    year: currentStudent?.year || '',
    graduation_year: currentStudent?.graduation_year || '',
    graduation_month: currentStudent?.graduation_month || '',
    graduation_date: currentStudent?.graduation_date || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to edit the student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_BASE_URL}/editStudent/${rollNo}`, formData);
      console.log('Student updated successfully', response.data);
      
      // Callback function to notify parent component of successful edit
      if (onEditSuccess) {
        onEditSuccess();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating student', error);
      setError('Failed to update the student. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Graduation Year:</label>
          <input
            type="text"
            name="graduation_year"
            value={formData.graduation_year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Graduation Month:</label>
          <input
            type="text"
            name="graduation_month"
            value={formData.graduation_month}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Graduation Date:</label>
          <input
            type="text"
            name="graduation_date"
            value={formData.graduation_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Student'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default EditStudentForm;
