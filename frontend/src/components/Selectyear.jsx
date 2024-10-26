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
import InfiniteScroll from "react-infinite-scroll-component";
const StudentRecords = ({
  students,
  checkedStates,
  setCheckedStates,
  setPrintEnabled,
  setStudents,
  setSearch,
  search,
  getStudents,
  entered,
  setEntered,
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

  console.log("errorMessage", errorMessage);
  const [password, setPassword] = useState(null);
  const [reason, setReason] = useState(null);
  console.log("password", password);

  // Select and enable print button
  const handleSelect = (index) => {
    const newCheckedStates = checkedStates.map((_, i) => i === index);
    setCheckedStates(newCheckedStates);
    setPrintEnabled(newCheckedStates.some((state) => state));
  };

  // Handle degree print preview
  // const handleDegreePrint = async (studentRecord) => {
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/student/${studentRecord.roll_no}`
  //     );

  //     // Check if the response status indicates success
  //     if (response.status === 200) {
  //       console.log("response", response);
  //       const count = response?.data?.student.count;
  //       setSelectedStudent(studentRecord);

  //       setPasswordModal(count === 0 ? false : true);
  //       setShowOverlayModal(true);
  //       setcheckCount(true);
  //     }
  //   } catch (error) {
  //     const message = error?.response?.data?.message || "An error occurred";
  //     setcheckCount(false);
  //     setSelectedStudent(studentRecord);
  //     setPasswordModal(true);
  //     setShowOverlayModal(true);
  //     setErrorMessage(error?.response?.data?.message || "An error occured");
  //     return { status: error.response?.status, message }; // Return status and message
  //   }
  // };

  const [showSerialModal, setShowSerialModal] = useState(false)
  console.log("showSerial modal", showSerialModal)
  const [serial, setSerial] = useState(null)
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
        setShowSerialModal(true)
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
      setShowSerialModal(true)

      setErrorMessage(error?.response?.data?.message || "An error occured");
      return { status: error.response?.status, message }; // Return status and message
    }

  };

  const handleSerialKey = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/serialnum/${selectedStudent.roll_no}`, { serial_num: serial }
      );

      // Check if the response status indicates success
      if (response.status === 200) {
        console.log("response", response);
        const count = response?.data?.data.count;
        const studentRecord = response?.data?.data;
        setSelectedStudent(studentRecord);
        setPasswordModal(count === 0 ? false : true);
        setShowOverlayModal(true);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "An error occurred";
      setPasswordModal(true);
      setShowOverlayModal(true);
      setShowSerialModal(true)
      setErrorMessage(error?.response?.data?.message || "An error occured");
      return { status: error.response?.status, message }; // Return status and message
    }

    setSerial("")
    setShowSerialModal(false)

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
        `${API_BASE_URL}/serialnum/${selectedStudent.roll_no}`, { reason: reason }
      );

      if (response.status === 200) {
        console.log("response", response);
      }
    } catch (error) {
      console.log('error',error)
    }
    setSerial("")
  }

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
                <th>Select</th>
                <th>Year</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Major</th>
                <th>Graduation Year</th>
                <th>Print Count</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((studentRecord, index) => (
                <tr key={`${studentRecord.roll_no}-${index}`}>
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
                  <td>{studentRecord.count}</td>
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

      <Modal
        size="md"
        show={showSerialModal}
        onHide={() => setShowSerialModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Serial Number</Modal.Title> {/* Title added here */}
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
          <Button
            variant="primary"
            onClick={handleSerialKey}
          >
            Enter
          </Button>
          <Button variant="secondary" onClick={() => setShowSerialModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="md"
        show={passwordModal}
        onHide={() => setPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Password & Reason</Modal.Title> {/* Title added here */}
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
                await handleReason()
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
              await handleReason()
              await checkPassword()
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
  console.log("students", students);

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

  const handleInputChange = async (e) => {
    setSearch(e.target.value);
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      setEntered(true);
      e.preventDefault();
      // e.stopPropagation();
      // setOffset(0); // Reset offset for new search
      await getStudents(); // Call the getStudents function
    }
  };
  const loaderRef = useRef(null);
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

  const getStudents = async () => {
    try {
      setLoading(true);
      console.log(`Fetching students with limit: ${limit}, offset: ${offset}`);

      const response = await axios.get(`${API_BASE_URL}/getYear`, {
        params: { year: selectedYear, limit, offset, search },
      });
      if (response.status === 200) {
        const newStudents = response.data;
        console.log("Fetched students:", newStudents);

        // Check if we have more students to load or we've loaded all the data
        setHasMore(newStudents.length === limit);

        // Add new students to the list
        // setStudents(newStudents);
        setStudents(newStudents &&
          search?.length === 0
          ? (prevStudents) => [...prevStudents, ...newStudents]
          : newStudents
        );

        // Add checked state for the newly loaded students
        setCheckedStates((prevStates) => [
          ...prevStates,
          ...new Array(newStudents.length).fill(false),
        ]);
      }
    } catch (error) {
      console.error("Error while getting students", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!selectedYear) return;
    if (search) {
      setOffset(0); // Reset offset for a new search
    }

    getStudents();
  }, [selectedYear, offset, limit, entered, search]);

  // useEffect(() => {
  //   if (search) {
  //     // Clear the previous students and reset offset when search changes
  //     setStudents([]);
  //     setOffset(0);
  //     setHasMore(true);
  //   }
  // }, [entered]);


  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Scroll event listener to detect bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      // Calculate if the user has scrolled near the bottom (within 100px)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        console.log("Reached bottom, fetching more students...");
        setOffset((prevOffset) => prevOffset + limit);
      }
    };
    // Add debounce to the scroll event listener
    const debouncedHandleScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [loading, hasMore, limit]);

  const handleYearSelection = (year) => {
    setSelectedYear(year);
    setStudents([]);
    setOffset(0);
    setHasMore(true);
  };

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
                style={{ cursor: "pointer" }}
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
          {students.length > 0 ? (
            <StudentRecords
              students={students}
              checkedStates={checkedStates}
              setCheckedStates={setCheckedStates}
              setPrintEnabled={setPrintEnabled}
              setStudents={setStudents}
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
