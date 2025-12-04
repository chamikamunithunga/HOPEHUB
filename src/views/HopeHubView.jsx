import React from 'react';
import { useHopeHub } from '../contexts/HopeHubContext';
import HomePage from '../pages/HomePage';
import SubmitRequestPage from '../pages/SubmitRequestPage';
import SuccessStoriesPage from '../pages/SuccessStoriesPage';

const HopeHubView = () => {
  const { currentPage } = useHopeHub();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'submit':
      return <SubmitRequestPage />;
    case 'success':
      return <SuccessStoriesPage />;
    default:
      return <HomePage />;
  }
};

export default HopeHubView;