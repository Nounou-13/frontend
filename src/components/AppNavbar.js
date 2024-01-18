import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto" >
        <Nav.Link as={Link} to="/airports">Aéroports</Nav.Link>
        <Nav.Link as={Link} to="/flights">Vols</Nav.Link>
        <Nav.Link as={Link} to="/tickets">Billets</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default AppNavbar;
