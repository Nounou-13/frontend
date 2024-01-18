// AirportList.js
import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';

const GET_AIRPORTS = gql`
  query {
    allAirports {
      name
    }
  }
`;

const AirportList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { loading, error, data } = useQuery(GET_AIRPORTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const airports = data.allAirports;

  const totalAirports = airports.length;
  const totalPages = Math.ceil(totalAirports / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalAirports);

  const currentAirports = airports.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Liste des Aéroports</h2>
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
                <Button variant="info">Détails</Button>
                <Button variant="warning">Modifier</Button>
                <Button variant="danger">Supprimer</Button>
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
    </div>
  );
};

export default AirportList;
