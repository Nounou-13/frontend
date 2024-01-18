import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AppLayout = ({ children }) => {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          {/* Contenu de l'en-tête ici */}
          <h1>Front-end</h1>
        </Col>
      </Row>
      <Row>
        <Col md={3}>{/* Menu de navigation ici */}</Col>
        <Col md={12}>{children}</Col>
      </Row>
      <Row>
        <Col className="text-center">Projet NoSql-Mahaman Laminou Dicko Nouredine</Col>
      </Row>
    </Container>
  );
};

export default AppLayout;
