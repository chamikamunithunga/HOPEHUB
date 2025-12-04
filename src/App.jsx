import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HopeHubProvider } from './contexts/HopeHubContext';
import HomePage from './pages/HomePage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import StatsOverview from './pages/StatsOverview';


const App = () => {
  return (
    <HopeHubProvider>
      <Router>
        <div className="app-wrapper">
          <StatsOverview />
          <SubmitRequestPage />
          <HomePage />
        </div>
      </Router>
    </HopeHubProvider>
  );
};

export default App;