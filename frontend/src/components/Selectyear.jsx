// import React, { useEffect, useState } from 'react';
// import { Table } from 'react-bootstrap';
// import "./Selectyear.css";
// import axios from 'axios';
// import { API_BASE_URL } from '../ApiConfig';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import NavBar from '../pages/NavBar';
// import Spinner from 'react-bootstrap/Spinner';

// const StudentRecords = ({ students, checkedStates, setCheckedStates, setPrintEnabled }) => {

//   const handleSelect = (index) => {
//     const newCheckedStates = new Array(checkedStates.length).fill(false); // Reset all to false
//     newCheckedStates[index] = true; // Set the selected one to true
  
//     setCheckedStates(newCheckedStates);
  
//     // Check if any checkbox is selected to enable the print button
//     const isAnyChecked = newCheckedStates.some(state => state === true);
//     setPrintEnabled(isAnyChecked);
//   };
  


//   const handlePrint = (studentRecord) => {
//     console.log("Printing student record:", studentRecord);
//   };

//   return (
//     <>
//       {students?.length > 0 && (
//         <div>
//           <h1>Student Records</h1>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th className="text-center">Select</th>
//                 <th className="text-center">Year</th>
//                 <th className="text-center">Name</th>
//                 <th className="text-center">Roll No</th>
//                 <th className="text-center">Graduation Year</th>
//                 <th className="text-center">Graduation Month</th>
//                 <th className="text-center">Graduation Date</th>
//                 <th className="text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((studentRecord, index) => (
//                 <tr key={index}>
//                   <td className="text-center">
//                     <Form.Check
//                       aria-label={`option ${index}`}
//                       checked={checkedStates[index]}
//                       onChange={() => handleSelect(index)}
//                     />
//                   </td>
//                   <td className="text-center">{studentRecord.year}</td>
//                   <td className="text-center">{studentRecord.name}</td>
//                   <td className="text-center">{studentRecord.roll_no}</td>
//                   <td className="text-center">{studentRecord.graduation_year}</td>
//                   <td className="text-center">{studentRecord.graduation_month}</td>
//                   <td className="text-center">{studentRecord.graduation_date}</td>
//                   <td className="text-center">
//                     <Button
//                       variant={checkedStates[index] ? "primary" : "outline-primary"} // Change variant based on checked state
//                       onClick={() => handlePrint(studentRecord)}
//                       disabled={!checkedStates[index]} // Only enable if this checkbox is checked
//                     >
//                       Print
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </>
//   );
// };

// export const Selectyear = () => {
//   const [years, setYears] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [checkedStates, setCheckedStates] = useState([]); // Array to track checked states
//   const [printEnabled, setPrintEnabled] = useState(false); // State to track if print button should be enabled

//   const [loading, setLoading] = useState(false)
//   useEffect(() => {
//     const getYears = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/years`);
//         if (response?.status) {
//           setYears(response?.data);
//         }
//       } catch (error) {
//         console.log('Error while getting years', error);
//       }
//     };

//     getYears();
//   }, []);

//   useEffect(() => {
//     if (!selectedYear) return;
//     const getStudents = async () => {
//       try {
//         setLoading(true)
//         const response = await axios.get(`${API_BASE_URL}/getYear?year=${selectedYear}`);
//         if (response?.status) {
//           setStudents(response?.data);
//           setCheckedStates(new Array(response.data.length).fill(false)); // Reset checked states on new data
//           setPrintEnabled(false); // Reset print button
//           setLoading(false)

//         }
//       } catch (error) {
//         console.log('Error while getting students', error);
//       } finally {
//         setLoading(false)

//       }
//     };

//     getStudents();
//   }, [selectedYear]);

//   return (
//     <>
//       <div>
//         <h1>Select Year</h1>
//         <Table striped bordered hover>
//           <tbody>
//             {years?.map((item, index) => (
//               <tr key={index}>
//                 <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => setSelectedYear(item?.year)}>
//                   {item?.year}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Student Records Section */}
//       {loading ?
//         <div className='mt-5 pt-5'>
//           <Spinner animation="border" role="status">
//           </Spinner >
//         </div>

//         :
//         <div>
//           <StudentRecords
//             students={students}
//             checkedStates={checkedStates}
//             setCheckedStates={setCheckedStates}
//             setPrintEnabled={setPrintEnabled}
//           />

//         </div>
//       }
//     </>
//   );
// };
























import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import "./Selectyear.css";
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const StudentRecords = ({ students, checkedStates, setCheckedStates, setPrintEnabled, setStudents }) => {

  const handleSelect = (index) => {
    const newCheckedStates = new Array(checkedStates.length).fill(false);
    newCheckedStates[index] = true;
    setCheckedStates(newCheckedStates);
  
    const isAnyChecked = newCheckedStates.some(state => state === true);
    setPrintEnabled(isAnyChecked);
  };

  const handlePrint = (studentRecord) => {
    console.log("Printing student record:", studentRecord);
  };

  const handleDelete = async (studentRecord, index) => {
    const confirmMessage = `Are you sure you want to remove the student?\nName: ${studentRecord.name}\nRoll No: ${studentRecord.roll_no}\nYear: ${studentRecord.year}`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Make API call to delete the student
        const response = await axios.delete(`${API_BASE_URL}/deleteStudent/${studentRecord.roll_no}`); // Adjust endpoint accordingly
        if (response.status === 200) {
          // Remove the student from the list
          const updatedStudents = students.filter((_, i) => i !== index);
          setStudents(updatedStudents);
          setCheckedStates(new Array(updatedStudents.length).fill(false)); // Reset checked states
          setPrintEnabled(false); // Reset print button
        }
      } catch (error) {
        console.log('Error while deleting student', error);
      }
    }
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
                      variant={checkedStates[index] ? "primary" : "outline-primary"}
                      onClick={() => handlePrint(studentRecord)}
                      disabled={!checkedStates[index]}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(studentRecord, index)}
                      className="ml-2"
                      disabled={!checkedStates[index]}
                    >
                      Delete
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
  const [checkedStates, setCheckedStates] = useState([]);
  const [printEnabled, setPrintEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/getYear?year=${selectedYear}`);
        if (response?.status) {
          setStudents(response?.data);
          setCheckedStates(new Array(response.data.length).fill(false));
          setPrintEnabled(false);
        }
      } catch (error) {
        console.log('Error while getting students', error);
      } finally {
        setLoading(false);
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
          <Spinner animation="border" role="status" />
        </div>
        :
        <div>
          <StudentRecords
            students={students}
            checkedStates={checkedStates}
            setCheckedStates={setCheckedStates}
            setPrintEnabled={setPrintEnabled}
            setStudents={setStudents} // Pass setStudents for state update
          />
        </div>
      }
    </>
  );
};
