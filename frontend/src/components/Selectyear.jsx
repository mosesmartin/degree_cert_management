import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  useRef,
} from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../ApiConfig";
import "./Selectyear.css";
import { MdAttachFile, MdPrint } from "react-icons/md";
import { FaTrash, FaEdit, FaUpload, FaStreetView } from "react-icons/fa";
import DegreeOverlay from "./DegreeOverlay";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import path from 'path';


const StudentRecords = ({
  students,
  checkedStates,
  setCheckedStates,
  setPrintEnabled,
  setStudents,
  setOriginalStudents,
  setSearch,
  search,
  getStudents,
  entered,
  setEntered,
  selectedProgram,
}) => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOverlayModal, setShowOverlayModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [checkCount, setcheckCount] = useState(false);
  console.log("checkCount", checkCount);
  console.log("search", search);

  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);

  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);

  console.log("errorMessage", errorMessage);
  const [password, setPassword] = useState(null);
  const [reason, setReason] = useState(null);
  console.log("password", password);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve the user role from session storage
    const role = sessionStorage.getItem('user_role');
    setUserRole(role);
  }, []);

  // Select and enable print button
  const handleSelect = (index) => {
    const newCheckedStates = checkedStates.map((_, i) => i === index);
    setCheckedStates(newCheckedStates);
    setPrintEnabled(newCheckedStates.some((state) => state));
  };

  const [showSerialModal, setShowSerialModal] = useState(false);
  const [showDegreeView, setshowDegreeView] = useState(false);
  console.log("showSerial modal", showSerialModal);
  const [serial, setSerial] = useState(null);
  const handleDegreePrint = async (studentRecord) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student/${studentRecord.roll_no}`
      );

      // Check if the response status indicates success
      if (response.status === 200) {
        console.log("response get student", response);
        const studentRecord = response?.data?.student;
        setSelectedStudent(studentRecord);
        setShowSerialModal(true);
        // setPasswordModal(count === 0 ? false : true);
        // setShowOverlayModal(true);
        // setcheckCount(true);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "An error occurred";
      // setcheckCount(false);
      // setSelectedStudent(studentRecord);
      // setPasswordModal(true);
      // setShowOverlayModal(true);
      setShowSerialModal(true);

      setErrorMessage(error?.response?.data?.message || "An error occured");
      return { status: error.response?.status, message }; // Return status and message
    }
  };

  const handleSerialKey = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/serialnum/${selectedStudent.roll_no}`,
        { serial_num: serial }
      );

      // Check if the response status indicates success
      if (response.status === 200) {
        console.log("response", response);
        const count = response?.data?.data.count;
        const studentRecord = response?.data?.data;
        setSelectedStudent(studentRecord);
        // setPasswordModal(count === 0 ? false : true);
        setPasswordModal(count !== 0);
        setcheckCount(count === 0);
        setShowOverlayModal(true);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "An error occurred";
      setPasswordModal(true);
      setShowOverlayModal(true);
      setShowSerialModal(true);
      setErrorMessage(error?.response?.data?.message || "An error occured");
      return { status: error.response?.status, message }; // Return status and message
    }

    setSerial("");
    setShowSerialModal(false);

    // setShowOverlayModal(true)
  };
  //Check password
  const checkPassword = async () => {
    if (!password || !reason) {
      if (!password && !reason) {
        toast.error("Password and reason are required");
      } else if (!password) {
        toast.error("Password is required");
      } else if (!reason) {
        toast.error("Reason is required");
      }
      return;
    }

    try {
      const payload = {
        enteredPassword: password,
        roll_no: selectedStudent?.roll_no,
      };
      const response = await axios.post(`${API_BASE_URL}/password`, payload);
      if (response?.status) {
        toast.success("Correct Passkey");
        setPasswordModal(false);
        setcheckCount(true);
      }
    } catch (error) {
      toast.error("Incorrect Passkey");
      setPasswordModal(true);
      setcheckCount(false);
    } finally {
      setPassword("");
    }
  };
  const handleReason = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/serialnum/${selectedStudent.roll_no}`,
        { reason: reason }
      );

      if (response.status === 200) {
        console.log("response", response);
      }
    } catch (error) {
      console.log("error", error);
    }
    setReason("");
  };

  const handlePrint = async (studentRecord, index) => {
    // Prompt user to confirm before proceeding
    if (
      window.confirm(
        "Make sure the printer is on and there is no blockage in the printer"
      )
    ) {
      const canvas = document.querySelector("canvas");
      if (!canvas) return console.error("Canvas not found!");

      try {
        // Assuming the selected student record is available
        const response = await axios.put(
          `${API_BASE_URL}/increment/${studentRecord.roll_no}`,
          {
            roll_no: studentRecord.roll_no, // Pass necessary data to the API
          }
        );

        if (response.status === 200) {
          console.log("Print data received from API:", response.data); // Handle response data if needed
          // setSelectedStudent({ ...studentRecord, ...response?.data?.count });

          // setStudents((prevStudents) =>
          //   prevStudents.map((student) =>
          //     student.roll_no === selectedStudent.roll_no
          //       ? { ...student, count: response?.data?.count } // Update the file field to true or with the file path
          //       : student
          //   )
          // );
          // Update the count in the students list
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.roll_no === studentRecord.roll_no
                ? { ...student, count: response.data?.data?.count } // Update the count from the API response
                : student
            )
          );
          // Create a new window for printing
          const printWindow = window.open("", "PRINT");

          // Write the HTML for the print window
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Degree</title>
                <style>
                  @media print {
                    body, html {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      overflow: hidden;
                    }
                    img {
                      display: block;
                      width: 100%; /* Fit the width of the paper */
                      height: 100%; /* Maintain aspect ratio */
                    }
                  }
                </style>
              </head>
              <body>
                <img src="${canvas.toDataURL(
                  "image/png"
                )}" alt="Degree Image" />
              </body>
            </html>
          `);

          // Close the document and trigger print
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          // printWindow.close();

          // After printing is complete, show the upload modal
          setSelectedStudent(studentRecord); // remember the current student record
          setShowUploadModal(true); // Open the upload modal
        } else {
          toast.error("Error fetching print data from API.");
        }
      } catch (error) {
        console.error("Error during printing process:", error);
        toast.error("Error during printing process.");
      }
    }
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
  const [filePaths,setFilePaths] = useState([])
  console.log('filePaths' ,filePaths )
  const handleView = async (studentRecord) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/view/${studentRecord.roll_no}`
      );
      if (response.status === 200 && response.data.success) {
        // Set filePaths and show modal
        setFilePaths(response.data.filePaths);
        setshowDegreeView(true);
      }
    } catch (error) {
      console.error("Error while viewing PDF:", error);
    }
  };
  
  const handleViewFile = (filePath) => {
    const fileUrl = `http://10.15.17.17:8000${filePath}`
    console.log("Opening file:", fileUrl); // Debugging line
    window.open(fileUrl, "_blank"); // Open in a new tab
};

  const handleUploadModalOpen = (studentRecord) => {
    console.log("studentRecord", studentRecord);
    console.log(
      "clicked on upload button",
      studentRecord?.serial_num?.[studentRecord.serial_num.length - 1]
    );
    setSelectedStudent(studentRecord);
    setShowUploadModal(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    console.log("setSelectedStudent", selectedStudent);
    const lastSerialNum =
      selectedStudent?.serial_num?.[selectedStudent.serial_num.length - 1] ||
      "";

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("serial_num", lastSerialNum || "");

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
        setIsUploaded(true);
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
  const rollNos = new Set();
  students.forEach((student) => {
    if (rollNos.has(student.roll_no)) {
      console.warn(`Duplicate roll_no found: ${student.roll_no}`);
    } else {
      rollNos.add(student.roll_no);
    }
  });
  return (
    <>
      {students.length > 0 && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>NO.</th>
                <th>Select</th>
                <th>Year</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Major</th>
                <th>program</th>
                <th>Graduation Year</th>
                <th>Print Count</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((studentRecord, index) => (
                <tr key={`${studentRecord.roll_no}-${index}`}>
                  <td>{index + 1}</td>

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
                  <td>{studentRecord.program}</td>
                  <td>{studentRecord.graduation_year}</td>
                  <td>{studentRecord.count}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      disabled={!checkedStates[index]}
                      onClick={() => handleDegreePrint(studentRecord)}
                    >
                      <MdPrint />
                    </Button>
                    {userRole === 'admin' && (<Button
                      variant="outline-warning"
                      disabled={!checkedStates[index]}
                      onClick={() => handleEdit(studentRecord)}
                    >
                      <FaEdit />
                    </Button>)}
                    {userRole === 'admin' &&(<Button
                      variant="outline-danger"
                      disabled={!checkedStates[index]}
                      onClick={() => handleDelete(studentRecord, index)}
                    >
                      <FaTrash />
                    </Button>)}
                    <Button
                      variant="outline-danger"
                      disabled={
                        !checkedStates[index] || studentRecord.count === 0
                      }
                      // disabled={!checkedStates[index]}
                      onClick={() => handleUploadModalOpen(studentRecord)}
                    >
                      <FaUpload />
                    </Button>
                    <Button
                      variant="outline-danger"
                      disabled={!checkedStates[index] || !studentRecord?.file}
                      onClick={() => handleView(studentRecord)}
                      // onClick={() => setshowDegreeView(true)}
                    >
                      <MdAttachFile />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
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
              canvasWidth={700}
              canvasHeight={800}
              program={selectedProgram}
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
          {checkCount && (
            <Button
              variant="primary"
              onClick={() => {
                handlePrint(selectedStudent);
                setShowOverlayModal(false); // Close modal after printing
              }}
            >
              Print
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* view degrees modal */}
      <Modal size="lg" show={showDegreeView} onHide={() => setshowDegreeView(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Select Degree</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div>
      {filePaths?.map((item, index) => {
        const fileName = item.split('\\').pop(); // Extract file name from path
        const trimmedFileName = fileName.replace('/uploads/', ''); // Trim '/uploads/' if present

        return (
          <div 
            key={index} 
            onClick={() => handleViewFile(item)}  // Keep the full path for clicking
            style={{ cursor: 'pointer', color: 'blue', margin: '5px 0' }} // Added margin for spacing
          >
            {trimmedFileName} {/* Display only the file name */}
          </div>
        );
      })}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setshowDegreeView(false)}>Close</Button>
  </Modal.Footer>
</Modal>




      {/* serial key modal */}
      <Modal
        size="md"
        show={showSerialModal}
        onHide={() => setShowSerialModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Serial Number</Modal.Title>{" "}
          {/* Title added here */}
        </Modal.Header>
        <Modal.Body>
          {/* {errorMessage && <div className="error-message">{errorMessage}</div>}{" "} */}
          <input
            type="text"
            value={serial || ""} // Ensure the value is always a string
            onChange={(e) => setSerial(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSerialKey();
              }
            }}
            placeholder="Enter serial number" // Optional placeholder
            className="form-control" // Bootstrap class for styling
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSerialKey}>
            Enter
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSerial("");
              setShowSerialModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* // pasword and reason modal */}

      <Modal
        size="md"
        show={passwordModal}
        onHide={() => setPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Password & Reason</Modal.Title>{" "}
          {/* Title added here */}
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <div className="error-message">{errorMessage}</div>}{" "}
          {/* Display error message */}
          <input
            type="text"
            value={reason || ""}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
            className="form-control" // Bootstrap class for styling
          />
          <input
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleReason();
                await checkPassword();
              }
            }}
            placeholder="Enter your password"
            className="form-control  mt-3"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={async () => {
              await handleReason();
              await checkPassword();
            }}
          >
            Enter
          </Button>
          <Button variant="secondary" onClick={() => setPasswordModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Message Modal END*/}

      {/* Upload File Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => {
          if (!isUploaded) return setUploading(false);
        }} // Optional, based on how you want to handle cancellation
      >
        <Modal.Header>
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
          <Button
            variant="secondary"
            onClick={() => {
              if (!isUploaded) return;
              setSelectedFile(null); // Clear selected file when cancelling
              setShowUploadModal(false);
            }}
            disabled={uploading} // Disable if uploading
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFileUpload}
            disabled={uploading || !selectedFile} // Disable if uploading or no file selected
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
  const [originalStudents, setOriginalStudents] = useState([]); // Holds the unfiltered list of students
  console.log("students", students);
  console.log("originalStudents", originalStudents);

  const [checkedStates, setCheckedStates] = useState([]);
  const [printEnabled, setPrintEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit] = useState(15);
  const [offset, setOffset] = useState(0);
  console.log("offset", offset);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState(""); // Track the search input
  const [entered, setEntered] = useState(false);
  console.log("entered", entered);
  // Debounced function to fetch students
  const fetchStudentsDebounced = useCallback(
    debounce(() => {
      getStudents();
    }, 300),
    []
    // [search, limit, offset]
  );

  // Handle input change and trigger debounced fetch
  const handleInputChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch); // Update search immediately // Update search immediately
    setOffset(0);
    // fetchStudentsDebounced(); // Trigger debounced function
    if (newSearch.trim()) {
      // Trigger debounced fetch if there is search input
      fetchStudentsDebounced();
    } else {
      // If search is cleared, restore the full list
      setStudents(originalStudents);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await getStudents();
    }
  };
  useEffect(() => {
    if (!search.trim()) {
      setStudents(originalStudents);
    }
  }, [search, originalStudents]);
  const loaderRef = useRef(null);

  const [programs, setPrograms] = useState([]);
  console.log("programs", programs);
  const [selectedProgram, setSelectedProgram] = useState("");
  console.log("selectedProgram", selectedProgram);

  const [isVisible, setIsVisible] = useState(false);

  const handleYearSelection = async (year) => {
    if (selectedYear !== year) {
      setSelectedYear(year); // Update the selected year if it's not already selected
      // setStudents([]);
      setOriginalStudents([]);
      setOffset(0);
      setHasMore(true);
      setIsVisible(false);
    }
    await getStudentPrograms(year);
  };

  const handleSelectProgram = async (item) => {
    console.log("item", item);
    setStudents([]);
    setSelectedProgram(item);
    setOriginalStudents([]);
    setOffset(0);
    setHasMore(true);
    setIsVisible(true);
  };

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

  const getStudentPrograms = async (year) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getYear`, {
        params: {
          year: year,
          limit: 5000,
        },
      });

      if (response.status === 200) {
        const newStudents = response.data;
        console.log("Fetched students:", newStudents);
        // Extract unique programs from the students
        const uniquePrograms = [
          ...new Set(newStudents.map((student) => student.program)),
        ];
        setPrograms(uniquePrograms);
      }
    } catch (error) {
      console.error("Error while getting students", error);
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async () => {
    try {
      setLoading(true);
      console.log(`Fetching students with limit: ${limit}, offset: ${offset}`);

      const response = await axios.get(`${API_BASE_URL}/getProgram`, {
        params: {
          // year: selectedYear,
          program: selectedProgram || "",
          offset: search.trim() ? 0 : offset,
          limit: search.trim() ? 1 : limit,
          search: search.trim() || "",
        },
      });

      if (response.status === 200) {
        const newStudents = response.data;
        console.log("Fetched students:", newStudents);

        setHasMore(newStudents.length === limit);

        setStudents((prevStudents) =>
          search.trim() ? newStudents : [...prevStudents, ...newStudents]
        );

        setCheckedStates((prevStates) => [
          ...prevStates,
          ...new Array(newStudents.length).fill(false),
        ]);

        if (!search.trim() && originalStudents.length === 0) {
          setOriginalStudents(newStudents);
        }
      }
    } catch (error) {
      console.error("Error while getting students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedProgram) return;
    if (search) {
      setOffset(0); // Reset offset for a new search
    }

    getStudents();
  }, [selectedProgram, offset, limit, entered]);

  // Scroll event listener to detect bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        console.log("Reached bottom, fetching more students...");
        setOffset((prevOffset) => prevOffset + limit);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [loading, hasMore, limit]);

  // const handleYearSelection = (year) => {
  //   setSelectedYear(year);
  //   // setStudents([]);
  //   setOriginalStudents([])
  //   setOffset(0);
  //   setHasMore(true);
  // };

  return (
    <>
      <div>
        <h1>Choose Graduating year</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover>
          <tbody>
            {years.map((item) => (
              <tr
                key={item.year}
                onClick={() => handleYearSelection(item.year)}
                style={{
                  cursor: selectedYear === item.year ? "pointer" : "pointer",
                  backgroundColor:
                    selectedYear === item.year ? "#f0f0f0" : "transparent",
                }}
              >
                <td className="text-center">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading && students.length === 0 ? (
        <div className="mt-5 pt-5 text-center">
          <Spinner animation="border" role="status" />
          <p>Loading student records...</p>
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <div className="d-flex gap-3 mt-4 ms-4 mb-3">
            {programs?.map((item, index) => (
              <div key={index}>
                {/* <span onClick={()=> handleSelectProgram(item)}>{item}</span> */}
                <button
                  onClick={() => handleSelectProgram(item)}
                  className="btn btn-primary"
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
          {isVisible && (
            <Form>
              <Form.Group controlId="searchInput">
                <Form.Control
                  type="text"
                  placeholder="Search by roll number or name.."
                  value={search}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // Handle Enter key press
                />
              </Form.Group>
            </Form>
          )}
          {students.length > 0 ? (
            <StudentRecords
              students={students}
              checkedStates={checkedStates}
              setCheckedStates={setCheckedStates}
              setPrintEnabled={setPrintEnabled}
              setStudents={setStudents}
              setOriginalStudents={setOriginalStudents}
              hasMore={hasMore}
              setOffset={setOffset}
              offset={offset}
              limit={limit}
              setHasMore={setHasMore}
              search={search}
              setSearch={setSearch}
              getStudents={getStudents}
              setEntered={setEntered}
              entered={entered}
              selectedProgram={selectedProgram}
            />
          ) : (
            <div className="mt-5 text-center">
              <p>No students found for the selected year.</p>
            </div>
          )}
        </Suspense>
      )}

      <div />
      <div ref={loaderRef} className="text-center my-4">
        {loading && students.length > 0 && hasMore && (
          <Spinner animation="border" role="status" />
        )}
      </div>
    </>
  );
};

export default Selectyear;
