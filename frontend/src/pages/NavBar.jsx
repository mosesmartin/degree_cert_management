import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
  return (
    <>
      
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">FORMAN CHRISTIAN COLLEGE</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/mainpage">Home</Nav.Link>
            <Nav.Link href="/importfile">Import Students</Nav.Link>
            <Nav.Link href="#pricing">About Us</Nav.Link>
            <Nav.Link href="#pricing">About Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      

      
    </>
  );
}

export default NavBar;