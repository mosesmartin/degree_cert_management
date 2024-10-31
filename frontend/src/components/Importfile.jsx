import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner
import Papa from 'papaparse';
import axios from 'axios';
import './Importfile.css';
import { API_BASE_URL } from '../ApiConfig';
import NavBar from '../pages/NavBar';
import { toast } from 'react-toastify';

export const Importfile = () => {
  const [data, setData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false); // Track if a file is selected
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      parseCSV(file);
      setFileSelected(true); // Set fileSelected to true when a file is chosen
    } else {
      setFileSelected(false); // Reset if no file is chosen
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        setData(results.data);
        console.log("Parsed Data:", results.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleImportClick = () => {
    if (data.length === 0) return; // Prevent import if no data
    setUploading(true); // Start loading
    axios.post(`${API_BASE_URL}/import`, data)
      .then(response => {
        toast.success(response.data.message);
      })
      .catch(error => {
        toast.error(error?.response?.data?.error);
        console.error("There was an error importing the data!", error);
      })
      .finally(() => {
        setUploading(false); // Reset loading state
        setFileSelected(false); // Reset file selection state
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input
        }
        setData([]); // Clear the data after upload
      });
  };

  return (
    <>
      <NavBar />
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
              ref={fileInputRef} // Attach ref to the file input
            />
          </Form.Group>
          <Button 
            onClick={handleImportClick} 
            disabled={!fileSelected || uploading} // Disable if no file is selected or if uploading
          >
            {uploading ? (
              <>
                <Spinner 
                  as="span" 
                  animation="border" 
                  size="sm" 
                  role="status" 
                  aria-hidden="true" 
                />
                <span className="sr-only">Importing...</span> 
              </>
            ) : (
              'Import Data'
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
