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
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-cyan-100 pb-12 relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Hope Request Board</h1>
        </div>
        
        <FilterBar />

        {openRequests.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-white shadow-sm mx-auto max-w-lg">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No requests found</h3>
            <p className="text-gray-600 px-4">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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