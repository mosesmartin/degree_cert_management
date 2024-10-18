import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Papa from 'papaparse';
import axios from 'axios'; // Import axios for making HTTP requests
import './Importfile.css'; // Make sure to create this CSS file
import { API_BASE_URL } from '../ApiConfig';
import NavBar from '../pages/NavBar';
import { toast } from 'react-toastify';

export const Importfile = () => {
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      parseCSV(file);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        setData(results.data);
        console.log("Parsed Data Arun:", results.data); // Log the parsed data
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleImportClick = () => {
    // Send data to the server
    axios.post(`${API_BASE_URL}/import`, data)
      .then(response => {
        console.log(response.data.message);
        toast.success("Data imported successfully")
        // Optionally handle success (e.g., show a success message)
      })
      .catch(error => {
        toast.error(error?.response?.data?.error)
        console.error("There was an error importing the data!", error);
        // Optionally handle error (e.g., show an error message)
      });
  };


  // const handleImportClick = async (data) => {
  //   try {
  //     await axios.post(`${API_BASE_URL}/import`, data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       maxContentLength: Infinity, // Set this to handle large payloads
  //       maxBodyLength: Infinity,    // Set this to handle large payloads
  //     });
  //     console.log("Data imported successfully!");
  //   } catch (error) {
  //     console.error("There was an error importing the data!", error);
  //   }
  // };


  return (
    <>
    < NavBar/>
    <div className="import-container">
      <div className="import-form">
        <h2>Import File</h2>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Select a CSV file.</Form.Label>
          <Form.Control 
            type="file" 
            size="lg" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </Form.Group>
        <Button onClick={handleImportClick} disabled={data.length === 0}>
          Import Data
        </Button>
      </div>
    </div>
    </> 
  );
};
