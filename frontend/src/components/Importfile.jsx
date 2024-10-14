import React from 'react';
import Form from 'react-bootstrap/Form';
import './Importfile.css'; // Make sure to create this CSS file

export const Importfile = () => {
  return (
    <div className="import-container">
      <div className="import-form">
        <h2>Import File</h2>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Select a CSV file</Form.Label>
          <Form.Control 
            type="file" 
            size="lg" 
            accept=".csv" 
          />
        </Form.Group>
      </div>
    </div>
  );
};
