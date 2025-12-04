import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';
import { FilterBar, RequestCard } from '../components/Helpers';
import DonationModal from '../components/DonationModal';

const HomePage = () => {
  const { filteredRequests } = useHopeHub();
  const openRequests = filteredRequests.filter(req => req.status === 'open');
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCardClick = (request) => {
    console.log("Card clicked:", request);
    setSelectedRequest(request);
  };

  return (
    <div className="home-page" id="home">
      
      <div className="container">
         
        <div className="home-title">
          <h1>Hope Request Board</h1>
        </div>
        
        <FilterBar />

        {openRequests.length === 0 ? (
          <div className="empty-state">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No requests found</h3>
            <p className="text-gray-600 px-4">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="req-grid">
            {openRequests.map(request => (
                <RequestCard 
                    key={request.id} 
                    request={request} 
                    onViewClick={handleCardClick} 
                />
            ))}
          </div>
        )}
      </div>

      {selectedRequest && (
        <DonationModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;