// FlightList.js
import React, { useState } from 'react';
import { Table, Button, Pagination, Modal, Form } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_FLIGHTS = gql`
  query {
    allFlights {
      date
      duration
      distance
      airline
    }
  }
`;

const ADD_FLIGHT = gql`
  mutation AddFlight($date: String!, $duration: Int!, $distance: Int!, $airline: String!, $origin: String!, $destination: String!) {
    addFlight(date: $date, duration: $duration, distance: $distance, airline: $airline, origin: $origin, destination: $destination) {
      date
      duration
      distance
      airline
    }
  }
`;

const UPDATE_FLIGHT = gql`
  mutation UpdateFlight($date: String!, $duration: Int!, $distance: Int!, $airline: String!, $origin: String!, $destination: String!) {
    updateFlight(date: $date, duration: $duration, distance: $distance, airline: $airline, origin: $origin, destination: $destination) {
      date
      duration
      distance
      airline
    }
  }
`;

const DELETE_FLIGHT = gql`
  mutation DeleteFlight($date: String!) {
    deleteFlight(date: $date) {
      success
      message
    }
  }
`;

const FlightList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('add');
  const [flightDetails, setFlightDetails] = useState({
    date: '',
    duration: 0,
    distance: 0,
    airline: '',
    origin: '',
    destination: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_FLIGHTS);
  const [addFlight] = useMutation(ADD_FLIGHT);
  const [updateFlight] = useMutation(UPDATE_FLIGHT);
  const [deleteFlight] = useMutation(DELETE_FLIGHT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const flights = data.allFlights;

  const itemsPerPage = 10;
  const totalFlights = flights.length;
  const totalPages = Math.ceil(totalFlights / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFlights);

  const currentFlights = flights.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddFlight = async () => {
    try {
      await addFlight({
        variables: {
          ...flightDetails,
        },
      });
      // Afficher un message de succès
      console.log('Vol ajouté avec succès !');
      // Actualiser la liste des vols
      refetch();
      // Fermer le formulaire
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un vol :', error.message);
    }
  };

  const handleUpdateFlight = async () => {
    try {
      await updateFlight({
        variables: {
          ...flightDetails,
        },
      });
      // Afficher un message de succès
      console.log('Vol mis à jour avec succès !');
      // Actualiser la liste des vols
      refetch();
      // Fermer le formulaire
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour d\'un vol :', error.message);
    }
  };

  const handleDeleteFlight = async (date) => {
    try {
      const result = await deleteFlight({
        variables: {
          date,
        },
      });
      // Afficher un message de succès
      console.log(result.data.deleteFlight.message);
      // Actualiser la liste des vols
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un vol :', error.message);
    }
  };

  const handleAction = (action, flight) => {
    setAction(action);
    setFlightDetails(flight || {
      date: '',
      duration: 0,
      distance: 0,
      airline: '',
      origin: '',
      destination: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAction('add');
    setFlightDetails({
      date: '',
      duration: 0,
      distance: 0,
      airline: '',
      origin: '',
      destination: '',
    });
  };

  return (
    <div>
      <h2>Liste des Vols</h2>
      <Button variant="primary" onClick={() => handleAction('add')}>
        Ajouter un Vol
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Duration</th>
            <th>Distance (miles)</th>
            <th>Airline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFlights.map((flight) => (
            <tr key={flight.date}>
              <td>{flight.date}</td>
              <td>{flight.duration}</td>
              <td>{flight.distance}</td>
              <td>{flight.airline}</td>
              <td>
                <Button variant="warning" onClick={() => handleAction('update', flight)}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteFlight(flight.date)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{action === 'add' ? 'Ajouter un Vol' : 'Modifier le Vol'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez la date du vol"
                value={flightDetails.date}
                onChange={(e) => setFlightDetails({ ...flightDetails, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrez la durée du vol"
                value={flightDetails.duration}
                onChange={(e) => setFlightDetails({ ...flightDetails, duration: parseInt(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formDistance">
              <Form.Label>Distance (miles)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrez la distance du vol"
                value={flightDetails.distance}
                onChange={(e) => setFlightDetails({ ...flightDetails, distance: parseInt(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formAirline">
              <Form.Label>Airline</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez la compagnie aérienne"
                value={flightDetails.airline}
                onChange={(e) => setFlightDetails({ ...flightDetails, airline: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formOrigin">
              <Form.Label>Origin</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez l'aéroport d'origine"
                value={flightDetails.origin}
                onChange={(e) => setFlightDetails({ ...flightDetails, origin: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDestination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez l'aéroport de destination"
                value={flightDetails.destination}
                onChange={(e) => setFlightDetails({ ...flightDetails, destination: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={action === 'add' ? handleAddFlight : handleUpdateFlight}>
            {action === 'add' ? 'Ajouter le Vol' : 'Enregistrer les Modifications'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlightList;
