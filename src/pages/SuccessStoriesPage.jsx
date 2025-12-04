import React from 'react';
import { CheckCircle, MapPin, Clock } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext'; 

const SuccessStoriesPage = () => {
  const { requests } = useHopeHub();
  const fulfilledRequests = requests.filter(req => req.status === 'fulfilled');

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Success Stories</h1>
          <p className="text-lg text-gray-600">{fulfilledRequests.length} students received help</p>
        </div>
        {fulfilledRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No success stories yet</h3>
            <p className="text-gray-600">Be the first to make a difference!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fulfilledRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{request.studentName}</h3>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" /> {request.location}, {request.district}
                  </div>
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Received:</h4>
                    <ul className="space-y-1">
                      {request.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesPage;