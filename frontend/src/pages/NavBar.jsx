import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
function NavBar() {
const navigate = useNavigate()
  const handleLogout = () =>{
    sessionStorage.clear();
    navigate('/')
  }
  return (
    <>
      
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">FORMAN CHRISTIAN COLLEGE</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/mainpage">Home</Nav.Link>
            <Nav.Link href="/importfile">Import Students</Nav.Link>
            <Nav.Link href="#pricing">About Us</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      

      
    </>
  );
}

export default NavBar;