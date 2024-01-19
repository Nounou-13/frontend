import React, { useState } from 'react';
import { Table, Button, Pagination, Modal, Form } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TICKETS = gql`
  query {
    allTickets {
      ticketClass
      price
    }
  }
`;

const ADD_TICKET = gql`
  mutation AddTicket($ticketClass: String!, $price: Float!, $flightDate: String!) {
    addTicket(ticketClass: $ticketClass, price: $price, flightDate: $flightDate) {
      ticketClass
      price
    }
  }
`;

const UPDATE_TICKET = gql`
  mutation UpdateTicket($ticketClass: String!, $ticketPrice: Float!, $newTicketClass: String, $newPrice: Float) {
    updateTicket(ticketClass: $ticketClass, ticketPrice: $ticketPrice, newTicketClass: $newTicketClass, newPrice: $newPrice) {
      ticketClass
      price
    }
  }
`;

const DELETE_TICKET = gql`
  mutation DeleteTicket($ticketClass: String!, $ticketPrice: Float!) {
    deleteTicket(ticketClass: $ticketClass, ticketPrice: $ticketPrice)
  }
`;

const TicketList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketClass, setNewTicketClass] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlightDate, setNewFlightDate] = useState('');


  const itemsPerPage = 10;

  const { loading, error, data, refetch } = useQuery(GET_TICKETS);
  const [updateTicket] = useMutation(UPDATE_TICKET);
  const [deleteTicket] = useMutation(DELETE_TICKET);
  const [addTicket] = useMutation(ADD_TICKET);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const tickets = data.allTickets;

  const totalTickets = tickets.length;
  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalTickets);

  const currentTickets = tickets.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdateClick = (ticket) => {
    setSelectedTicket(ticket);
    setNewTicketClass(ticket.ticketClass);
    setNewPrice(ticket.price);
    setShowModal(true);
  };

  const handleAddTicket = async () => {
    try {
      await addTicket({
        variables: {
          ticketClass: newTicketClass,
          price: parseFloat(newPrice),
          flightDate: newFlightDate,
        },
      });

      await refetch();
      setSuccessMessage('Billet ajouté avec succès');
      handleCloseAddModal(); // Fermer le formulaire après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un billet:', error.message);
      // Afficher un message d'erreur si nécessaire
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateTicket({
        variables: {
          ticketClass: selectedTicket.ticketClass,
          ticketPrice: selectedTicket.price,
          newTicketClass: newTicketClass || null,
          newPrice: newPrice !== '' ? parseFloat(newPrice) : null,
        },
      });

      await refetch();
      setSuccessMessage('Billet mis à jour avec succès'); // Nouveau message de succès
      handleCloseModal(); // Fermer le modal
    } catch (error) {
      console.error('Erreur lors de la mise à jour du billet:', error.message);
      // Afficher un message d'erreur si nécessaire
    }
  };
  

  const handleDeleteClick = async (ticket) => {
    try {
      await deleteTicket({
        variables: {
          ticketClass: ticket.ticketClass,
          ticketPrice: ticket.price,
        },
      });

      await refetch();
      setSuccessMessage('Billet supprimé avec succès'); // Nouveau message de succès
    } catch (error) {
      console.error('Erreur lors de la suppression du billet:', error.message);
      // Afficher un message d'erreur si nécessaire
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setNewTicketClass('');
    setNewPrice('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewTicketClass('');
    setNewPrice('');
    setNewFlightDate('');
    setSuccessMessage(''); // Réinitialiser le message de succès
  };

  return (
    <div>
      {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
      <h2>Liste des Billets</h2>

        {/* Bouton d'ajout de billet */}
            <Button variant="success" onClick={() => setShowAddModal(true)} style={{ marginBottom: '15px' }}>
              Ajouter un Billet
            </Button>
                {/* Formulaire d'ajout de billet */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Billet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTicketClass">
              <Form.Label>Classe du Billet</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez la classe du billet"
                value={newTicketClass}
                onChange={(e) => setNewTicketClass(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Prix du Billet</Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrez le prix du billet"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFlightDate">
              <Form.Label>Date du Vol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez la date du vol (format: YYYY-MM-DD)"
                value={newFlightDate}
                onChange={(e) => setNewFlightDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddTicket}>
            Ajouter le Billet
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover>
        {/* Table Header */}
        <thead>
          <tr>
            <th>Classe</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.ticketClass}>
              <td>{ticket.ticketClass}</td>
              <td>{ticket.price}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateClick(ticket)}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteClick(ticket)}>
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

      {/* Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Billet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTicketClass">
              <Form.Label>Classe du Billet</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez la nouvelle classe du billet"
                value={newTicketClass}
                onChange={(e) => setNewTicketClass(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Prix du Billet</Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrez le nouveau prix du billet"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
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

export default TicketList;
