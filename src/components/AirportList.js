// AirportList.js
import React, { useState } from 'react';
import { Table, Button, Pagination, Modal, Form, Alert } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_AIRPORTS = gql`
  query {
    allAirports {
      name
    }
  }
`;

const ADD_AIRPORT = gql`
  mutation AddAirport($name: String!) {
    addAirport(name: $name) {
      name
    }
  }
`;

const UPDATE_AIRPORT = gql`
  mutation UpdateAirport($oldName: String!, $newName: String!) {
    updateAirport(oldName: $oldName, newName: $newName) {
      name
    }
  }
`;

const DELETE_AIRPORT = gql`
  mutation DeleteAirport($name: String!) {
    deleteAirport(name: $name)
  }
`;

const AirportList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const itemsPerPage = 10;

  const { loading, error, data, refetch } = useQuery(GET_AIRPORTS);
  const [addAirport] = useMutation(ADD_AIRPORT);
  const [updateAirport] = useMutation(UPDATE_AIRPORT);
  const [deleteAirport] = useMutation(DELETE_AIRPORT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const airports = data.allAirports.filter((airport) =>
    airport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAirports = airports.length;
  const totalPages = Math.ceil(totalAirports / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalAirports);

  const currentAirports = airports.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async () => {
    try {
      await addAirport({
        variables: {
          name: newName,
        },
      });

      await refetch();
      setSuccessMessage('Aéroport ajouté avec succès.');
      setShowSuccessAlert(true);
      handleCloseAddModal();
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un aéroport:', error.message);
    }
  };

  const handleUpdateClick = (airport) => {
    setSelectedAirport(airport);
    setNewName(airport.name);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateAirport({
        variables: {
          oldName: selectedAirport.name,
          newName: newName,
        },
      });

      await refetch();
      setSuccessMessage('Aéroport mis à jour avec succès.');
      setShowSuccessAlert(true);
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'aéroport:', error.message);
    }
  };

  const handleDeleteClick = async (airport) => {
    try {
      await deleteAirport({
        variables: {
          name: airport.name,
        },
      });

      await refetch();
      setSuccessMessage('Aéroport supprimé avec succès.');
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'aéroport:', error.message);
    }
  };


  const handleAlertClose = () => {
    setShowSuccessAlert(false);
    setSuccessMessage('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewName('');
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedAirport(null);
    setNewName('');
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert variant="success" onClose={handleAlertClose} dismissible>
          {successMessage}
        </Alert>
      )}

      <h2>Liste des Aéroports</h2>
      <Form.Group controlId="formSearchAirport">
        <Form.Label>Rechercher un Aéroport</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entrez le nom de l'aéroport"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      
      <Button variant="success" onClick={handleAddClick}>
        Ajouter un Aéroport
      </Button>
      <Table striped bordered hover>
        {/* Table Header */}
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {currentAirports.map((airport) => (
            <tr key={airport.name}>
              <td>{airport.name}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateClick(airport)}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteClick(airport)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Aéroport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAirportName">
              <Form.Label>Nom de l'Aéroport</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de l'aéroport"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddSubmit}>
            Ajouter l'Aéroport
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'Aéroport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAirportName">
              <Form.Label>Nouveau Nom de l'Aéroport</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nouveau nom de l'aéroport"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AirportList;
