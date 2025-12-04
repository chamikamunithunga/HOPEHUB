import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HopeHubProvider } from './contexts/HopeHubContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';

const App = () => {
  return (
    <HopeHubProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-gray-900">
          <Navigation />
          
          <main className="grow">
            <Routes>
              <Route path="/" element={<Navigate to="/hub-view" replace />} />
              <Route path="/hub-view" element={<HomePage />} />
              <Route path="/submit" element={<SubmitRequestPage />} />
              <Route path="/success" element={<SuccessStoriesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HopeHubProvider>
  );
};

export default App;