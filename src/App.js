import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AppNavbar from './components/AppNavbar';
import AirportList from './components/AirportList';
import FlightList from './components/FlightList';
import TicketList from './components/TicketList';

const App = () => {
  return (
    <Router>
      <AppLayout>
        <AppNavbar />
        <Routes>
          <Route path="/airports" element={<AirportList />} />
          <Route path="/flights" element={<FlightList />} />
          <Route path="/tickets" element={<TicketList />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
