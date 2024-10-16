import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';
import './Selectyear.css';
import { MdAttachFile, MdPrint } from 'react-icons/md';
import { FaTrash, FaEdit, FaUpload, FaStreetView } from 'react-icons/fa';
import DegreeOverlay from './DegreeOverlay';
import { toast } from 'react-toastify';

const StudentRecords = ({ students, checkedStates, setCheckedStates, setPrintEnabled, setStudents }) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOverlayModal, setShowOverlayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSelect = (index) => {
    const newCheckedStates = checkedStates.map((_, i) => i === index);
    setCheckedStates(newCheckedStates);
    setPrintEnabled(newCheckedStates.some(state => state));
  };

  const handleDegreePrint = (studentRecord) => {
    setSelectedStudent(studentRecord);
    setShowOverlayModal(true);
  };

  const handlePrint = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas not found!');
      return;
    }

    const printWindow = window.open('', 'PRINT', 'height=3300,width=2550');
    printWindow.document.write('<html><head><title>Print Degree</title></head><body>');
    printWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" style="width:3300;height:2550;"/>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // printWindow.close();
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
          toast.success("Record deleted successfully")
        }
      } catch (error) {
        console.error('Error while deleting student', error);
        toast.error("Error while deleting student")

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
        toast.success("Record updated successfully")

      }
    } catch (error) {
      toast.error("Error while updating studen")
      console.error('Error while updating student', error);
    }
  };
  const handleUpload = async (studentRecord, index) => {

    try {
      const formData = new FormData();
      // formData.append("file",file)
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
      if (response.status === 200) {
        // setStudents(updatedStudents);
        
      }
    } catch (error) {
      console.error('Error while deleting student', error);
    }
  };
  const handleView = async (studentRecord, index) => {

    try {
      const response = await axios.get(`${API_BASE_URL}/file/${studentRecord?.roll_no}`);
      console.log('response',response);
      if (response.status === 200) {

        const fileURL = response?.data?.data;

      // Open the PDF in a new tab
      window.open(fileURL, '_blank');



        // setStudents(updatedStudents);
        
      }
    } catch (error) {
      console.error('Error while view pdf', error);
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
                <th className="text-center">Major</th>
                <th className="text-center">Graduation Year</th>
                <th className="text-center">Graduation Month</th>
                <th className="text-center">Graduation Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .sort((a, b) => a.major.localeCompare(b.major)) // Sort by 'major' in ascending order
                .map((studentRecord, index) => (
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
                    <td className="text-center">{studentRecord.major}</td>
                    <td className="text-center">{studentRecord.graduation_year}</td>
                    <td className="text-center">{studentRecord.graduation_month}</td>
                    <td className="text-center">{studentRecord.graduation_date}</td>
                    <td className="text-center">
                      <Button
                        variant={checkedStates[index] ? 'outline-primary' : 'outline-primary'}
                        onClick={() => handleDegreePrint(studentRecord)}
                        disabled={!checkedStates[index]}
                      >
                        <MdPrint />
                      </Button>
                      <Button
                        variant="outline-warning"
                        onClick={() => handleEdit(studentRecord)}
                        className="ml-2"
                        disabled={!checkedStates[index]}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(studentRecord, index)}
                        className="ml-2"
                        disabled={!checkedStates[index]}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleUpload(studentRecord, index)}
                        className="ml-2"
                      >
                        <FaUpload />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleView(studentRecord, index)}
                        className="ml-2"
                      >
                        <MdAttachFile />
                      </Button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Degree Print Modal */}
          <Modal show={showOverlayModal} onHide={() => setShowOverlayModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Degree Print Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedStudent && (
                <DegreeOverlay studentRecord={selectedStudent} canvasWidth={3300} canvasHeight={2550} />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowOverlayModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handlePrint}>
                Print
              </Button>
            </Modal.Footer>
          </Modal>

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
                  <Form.Label>Major</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingStudent?.major || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, major: e.target.value })}
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
