import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  useRef
} from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig";
import "./Selectyear.css";
import { MdAttachFile, MdPrint } from "react-icons/md";
import { FaTrash, FaEdit, FaUpload, FaStreetView } from "react-icons/fa";
import DegreeOverlay from "./DegreeOverlay";
import { toast } from "react-toastify";

const StudentRecords = ({
  students,
  checkedStates,
  setCheckedStates,
  setPrintEnabled,
  setStudents,
}) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlayModal, setShowOverlayModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Select and enable print button
  const handleSelect = (index) => {
    const newCheckedStates = checkedStates.map((_, i) => i === index);
    setCheckedStates(newCheckedStates);
    setPrintEnabled(newCheckedStates.some((state) => state));
  };

  // Handle degree print preview
  const handleDegreePrint = (studentRecord) => {
    setSelectedStudent(studentRecord);
    setShowOverlayModal(true);
  };

  const handlePrint = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return console.error("Canvas not found!");

    const printWindow = window.open("", "PRINT", "height=3300,width=2550");
    printWindow.document.write(
      "<html><head><title>Print Degree</title></head><body>"
    );
    printWindow.document.write(
      `<img src="${canvas.toDataURL(
        "image/png"
      )}" style="width:3300;height:2550;"/>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDelete = async (studentRecord, index) => {
    if (
      window.confirm(
        `Are you sure you want to remove the student?\nName: ${studentRecord.name}`
      )
    ) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/deleteStudent/${studentRecord.roll_no}`
        );
        if (response.status === 200) {
          const updatedStudents = students.filter((_, i) => i !== index);
          setStudents(updatedStudents);
          setCheckedStates(new Array(updatedStudents.length).fill(false));
          setPrintEnabled(false);
          toast.success("Record deleted successfully");
        }
      } catch (error) {
        toast.error("Error while deleting student");
      }
    }
  };

  const handleEdit = (studentRecord) => {
    setEditingStudent(studentRecord);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateStudent/${editingStudent.roll_no}`,
        editingStudent
      );
      if (response.status === 200) {
        setStudents((prev) =>
          prev.map((student) =>
            student.roll_no === editingStudent.roll_no
              ? editingStudent
              : student
          )
        );
        setShowEditModal(false);
        toast.success("Record updated successfully");
      }
    } catch (error) {
      toast.error("Error while updating student");
    } finally {
      setEditLoading(false);
    }
  };

  const handleView = async (studentRecord) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/view/${studentRecord.roll_no}`,
        {
          responseType: "arraybuffer",
        }
      );
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      }
    } catch (error) {
      console.error("Error while viewing PDF:", error);
    }
  };

  const handleUploadModalOpen = (studentRecord) => {
    setSelectedStudent(studentRecord);
    setShowUploadModal(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload/${selectedStudent.roll_no}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        // Find and update the student record in the state to reflect the uploaded file
      setStudents((prevStudents) => 
        prevStudents.map((student) =>
          student.roll_no === selectedStudent.roll_no
            ? { ...student, file: true } // Update the file field to true or with the file path
            : student
        )
      );
        toast.success("File uploaded successfully");

        setShowUploadModal(false);
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error("Error while uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {students.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Select</th>
              <th>Year</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Major</th>
              <th>Graduation Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((studentRecord, index) => (
              <tr key={studentRecord.roll_no}>
                <td>
                  <Form.Check
                    checked={checkedStates[index]}
                    onChange={() => handleSelect(index)}
                  />
                </td>
                <td>{studentRecord.year}</td>
                <td>{studentRecord.name}</td>
                <td>{studentRecord.roll_no}</td>
                <td>{studentRecord.major}</td>
                <td>{studentRecord.graduation_year}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    disabled={!checkedStates[index]}
                    onClick={() => handleDegreePrint(studentRecord)}
                  >
                    <MdPrint />
                  </Button>
                  <Button
                    variant="outline-warning"
                    disabled={!checkedStates[index]}
                    onClick={() => handleEdit(studentRecord)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    disabled={!checkedStates[index]}
                    onClick={() => handleDelete(studentRecord, index)}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="outline-danger"
                    disabled={!checkedStates[index]}
                    onClick={() => handleUploadModalOpen(studentRecord)}
                  >
                    <FaUpload />
                  </Button>
                  <Button
                    variant="outline-danger"
                    disabled={!checkedStates[index] || !studentRecord?.file}
                    onClick={() => handleView(studentRecord)}
                  >
                    <MdAttachFile />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modals for printing, editing, uploading */}
      {/* Degree Print Modal */}
      <Modal
        show={showOverlayModal}
        onHide={() => setShowOverlayModal(false)}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Degree Print Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <DegreeOverlay
              studentRecord={selectedStudent}
              canvasWidth={3300}
              canvasHeight={2550}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOverlayModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload File Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileUpload">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>
            {uploading && <Spinner animation="border" />}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFileUpload}
            disabled={uploading}
          >
            Upload
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
                value={editingStudent?.name || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formRollNo">
              <Form.Label>Roll No</Form.Label>
              <Form.Control
                type="text"
                value={editingStudent?.roll_no || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    roll_no: e.target.value,
                  })
                }
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formGraduationYear">
              <Form.Label>Major</Form.Label>
              <Form.Control
                type="text"
                value={editingStudent?.major || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    major: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGraduationYear">
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control
                type="text"
                value={editingStudent?.graduation_year || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    graduation_year: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGraduationMonth">
              <Form.Label>Graduation Month</Form.Label>
              <Form.Control
                type="text"
                value={editingStudent?.graduation_month || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    graduation_month: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGraduationDate">
              <Form.Label>Graduation Date</Form.Label>
              <Form.Control
                type="text"
                value={editingStudent?.graduation_date || ""}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    graduation_date: e.target.value,
                  })
                }
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
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0); // Added offset
  const [limit, setLimit] = useState(10); // Set the limit for pagination
  const loaderRef = useRef(null); // Ref for infinite scroll observer

  useEffect(() => {
    const getYears = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/years`);
        if (response.status === 200) {
          setYears(response.data);
        } else {
          setError("Failed to fetch years.");
        }
      } catch (error) {
        console.error("Error while getting years", error);
      }
    };

    getYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setStudents([]);
      setCheckedStates([]);
      setOffset(0);
      return;
    }

    const getStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/getYear?year=${selectedYear}`
        );
        if (response.status === 200) {
          const limitedStudents = response.data.slice(0, 10);
          setStudents(limitedStudents)

          // setStudents((prev) => [...prev, ...limitedStudents]); // Append new students
          setCheckedStates(new Array(response.data.length).fill(false));
          setPrintEnabled(false);
        } else {
          setError("Failed to fetch students.");
        }
      } catch (error) {
        setError("Error while getting students");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [selectedYear]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setOffset((prevOffset) => prevOffset + limit); // Load more
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  return (
    <>
      <div>
        <h1>Select Year</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover>
          <tbody>
            {years.map((item) => (
              <tr
                key={item.year}
                onClick={() => setSelectedYear(item.year)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedYear === item.year ? "#e0f7fa" : "",
                }}
              >
                <td className="text-center">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading ? (
        <div className="mt-5 pt-5 text-center">
          <Spinner animation="border" role="status" />
          <p>Loading student records...</p>
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {students.length > 0 ? (
            <StudentRecords
              students={students}
              checkedStates={checkedStates}
              setCheckedStates={setCheckedStates}
              setPrintEnabled={setPrintEnabled}
              setStudents={setStudents}
            />
          ) : (
            <div className="mt-5 text-center">
              <p>No students found for the selected year.</p>
            </div>
          )}
        </Suspense>
      )}

      <div ref={loaderRef} style={{ height: "20px" }} />
    </>
  );
};

export default Selectyear;
