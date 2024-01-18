// FlightList.js
import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';

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

const FlightList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { loading, error, data } = useQuery(GET_FLIGHTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const flights = data.allFlights;

  const totalFlights = flights.length;
  const totalPages = Math.ceil(totalFlights / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFlights);

  const currentFlights = flights.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Liste des Vols</h2>
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
                <Button variant="info">Détails</Button>
                <Button variant="warning">Modifier</Button>
                <Button variant="danger">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    </div>
  );
};

export default FlightList;
