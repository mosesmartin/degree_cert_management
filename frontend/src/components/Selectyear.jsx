import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';
import './Selectyear.css';
import { MdPrint } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import {FaEdit } from 'react-icons/fa';


const StudentRecords = ({ students, checkedStates, setCheckedStates, setPrintEnabled, setStudents }) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSelect = (index) => {
    const newCheckedStates = checkedStates.map((_, i) => i === index);
    setCheckedStates(newCheckedStates);
    setPrintEnabled(newCheckedStates.some(state => state));
  };

  const handlePrint = (studentRecord) => {
    console.log('Printing student record:', studentRecord);
  };

  const handleDelete = async (studentRecord, index) => {
    const confirmMessage = `Are you sure you want to remove the student?\nName: ${studentRecord.name}\nRoll No: ${studentRecord.roll_no}\nYear: ${studentRecord.year}`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/deleteStudent/${studentRecord.roll_no}`);
        if (response.status === 200) {
          const updatedStudents = students.filter((_, i) => i !== index);
          setStudents(updatedStudents);
          setCheckedStates(new Array(updatedStudents.length).fill(false));
          setPrintEnabled(false);
          console.log('Deleting student with roll_no:', studentRecord.roll_no);
        }
      } catch (error) {
        console.error('Error while deleting student', error);
      }
    }
  };

  const handleEdit = (studentRecord) => {
    setEditingStudent(studentRecord);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/updateStudent/${editingStudent.roll_no}`, editingStudent);

      if (response.status === 200) {
        const updatedStudents = students.map(student =>
          student.roll_no === editingStudent.roll_no ? editingStudent : student
        );
        setStudents(updatedStudents);
        setShowEditModal(false);
        console.log('Updated student:', editingStudent);
      }
    } catch (error) {
      console.error('Error while updating student', error);
    }
  };

  return (
    <>
      {students.length > 0 && (
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
                <tr key={studentRecord.roll_no}>
                  <td className="text-center">
                    <Form.Check
                      aria-label={`Select ${studentRecord.name}`}
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
                      variant={checkedStates[index] ? 'outline-primary' : 'outline-primary'}
                      onClick={() => handlePrint(studentRecord)}
                      disabled={!checkedStates[index]}
                    >
                      <MdPrint/>
                    </Button>
                    <Button
                      variant="outline-warning"
                      onClick={() => handleEdit(studentRecord)}
                      className="ml-2"
                      disabled={!checkedStates[index]} // Disable if checkbox is not checked
                    >
                     <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(studentRecord, index)}
                      className="ml-2"
                      disabled={!checkedStates[index]}
                    >
                      {/* delete button react icon */}
                      <FaTrash />

                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Edit Student Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formStudentName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formRollNo">
                  <Form.Label>Roll No</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.roll_no || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roll_no: e.target.value })}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formGraduationYear">
                  <Form.Label>Graduation Year</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.graduation_year || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, graduation_year: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formGraduationMonth">
                  <Form.Label>Graduation Month</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.graduation_month || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, graduation_month: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formGraduationDate">
                  <Form.Label>Graduation Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.graduation_date || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, graduation_date: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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
        if (response.status === 200) {
          setYears(response.data);
        }
      } catch (error) {
        console.error('Error while getting years', error);
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
        if (response.status === 200) {
          setStudents(response.data);
          setCheckedStates(new Array(response.data.length).fill(false));
          setPrintEnabled(false);
        }
      } catch (error) {
        console.error('Error while getting students', error);
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
            {years.map((item) => (
              <tr key={item.year} onClick={() => setSelectedYear(item.year)} style={{ cursor: 'pointer' }}>
                <td className="text-center">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Student Records Section */}
      {loading ? (
        <div className='mt-5 pt-5 text-center'>
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <StudentRecords
          students={students}
          checkedStates={checkedStates}
          setCheckedStates={setCheckedStates}
          setPrintEnabled={setPrintEnabled}
          setStudents={setStudents}
        />
      )}
    </>
  );
};

export default Selectyear;
