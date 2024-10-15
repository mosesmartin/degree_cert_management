import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import "./Selectyear.css";
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavBar from '../pages/NavBar';
import Spinner from 'react-bootstrap/Spinner';

const StudentRecords = ({ students, checkedStates, setCheckedStates, setPrintEnabled }) => {

  const handleSelect = (index) => {
    const newCheckedStates = new Array(checkedStates.length).fill(false); // Reset all to false
    newCheckedStates[index] = true; // Set the selected one to true
  
    setCheckedStates(newCheckedStates);
  
    // Check if any checkbox is selected to enable the print button
    const isAnyChecked = newCheckedStates.some(state => state === true);
    setPrintEnabled(isAnyChecked);
  };
  


  const handlePrint = (studentRecord) => {
    console.log("Printing student record:", studentRecord);
  };

  return (
    <>
      {students?.length > 0 && (
        <div>
          <h1>Student Records</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Select</th>
                <th className="text-center">Year</th>
                <th className="text-center">Name</th>
                <th className="text-center">Roll No</th>
                <th className="text-center">Graduation Year</th>
                <th className="text-center">Graduation Month</th>
                <th className="text-center">Graduation Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((studentRecord, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <Form.Check
                      aria-label={`option ${index}`}
                      checked={checkedStates[index]}
                      onChange={() => handleSelect(index)}
                    />
                  </td>
                  <td className="text-center">{studentRecord.year}</td>
                  <td className="text-center">{studentRecord.name}</td>
                  <td className="text-center">{studentRecord.roll_no}</td>
                  <td className="text-center">{studentRecord.graduation_year}</td>
                  <td className="text-center">{studentRecord.graduation_month}</td>
                  <td className="text-center">{studentRecord.graduation_date}</td>
                  <td className="text-center">
                    <Button
                      variant={checkedStates[index] ? "primary" : "outline-primary"} // Change variant based on checked state
                      onClick={() => handlePrint(studentRecord)}
                      disabled={!checkedStates[index]} // Only enable if this checkbox is checked
                    >
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export const Selectyear = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [students, setStudents] = useState([]);
  const [checkedStates, setCheckedStates] = useState([]); // Array to track checked states
  const [printEnabled, setPrintEnabled] = useState(false); // State to track if print button should be enabled

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getYears = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/years`);
        if (response?.status) {
          setYears(response?.data);
        }
      } catch (error) {
        console.log('Error while getting years', error);
      }
    };

    getYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const getStudents = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/getYear?year=${selectedYear}`);
        if (response?.status) {
          setStudents(response?.data);
          setCheckedStates(new Array(response.data.length).fill(false)); // Reset checked states on new data
          setPrintEnabled(false); // Reset print button
          setLoading(false)

        }
      } catch (error) {
        console.log('Error while getting students', error);
      } finally {
        setLoading(false)

      }
    };

    getStudents();
  }, [selectedYear]);

  return (
    <>
      <div>
        <h1>Select Year</h1>
        <Table striped bordered hover>
          <tbody>
            {years?.map((item, index) => (
              <tr key={index}>
                <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => setSelectedYear(item?.year)}>
                  {item?.year}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Student Records Section */}
      {loading ?
        <div className='mt-5 pt-5'>
          <Spinner animation="border" role="status">
          </Spinner >
        </div>

        :
        <div>
          <StudentRecords
            students={students}
            checkedStates={checkedStates}
            setCheckedStates={setCheckedStates}
            setPrintEnabled={setPrintEnabled}
          />

        </div>
      }
    </>
  );
};
