import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";

function NavBar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve the user role from session storage
    const role = sessionStorage.getItem('user_role');
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    toast.success("Logout successfully");
  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand style={{ cursor: 'pointer' }}>Degree Management System</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/mainpage">Home</Nav.Link>
            
            {/* Conditionally render "Import Students" link only if user_role is "admin" */}
            {userRole === 'admin' && (
              <Nav.Link href="/importfile">Import Students</Nav.Link>
            )}
            {/* Conditionally render "Import Students" link only if user_role is "admin" */}
            {userRole === 'admin' && (
              <Nav.Link href="/AddUser">Add User</Nav.Link>
            )}
            
            <Nav.Link href="#pricing">About Us</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
