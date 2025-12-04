import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Eye, EyeOff, Phone, MessageCircle } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

export const FilterBar = () => {
  const {
    selectedDistrict, setSelectedDistrict,
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery
  } = useHopeHub();

  const districts = ['all', 'Gampaha', 'Kalutara', 'Matara', 'Colombo', 'Galle'];
  const categories = ['all', 'Textbooks', 'Uniforms', 'Stationery', 'Shoes', 'Bags'];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 py-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, location, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-transparent bg-white outline-none cursor-pointer"
            >
              {districts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Districts' : d}</option>)}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-transparent bg-white outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RequestCard = ({ request }) => {
  const [showContact, setShowContact] = useState(false);
  const { updateRequestStatus } = useHopeHub();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello ${request.studentName}, I saw your request on HopeHub. I would like to help with: ${request.items.join(', ')}`);
    window.open(`https://wa.me/94${request.phone.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  const handleMarkFulfilled = () => {
    if (window.confirm('Are you sure you want to mark this request as fulfilled?')) {
      updateRequestStatus(request.id, 'fulfilled');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{request.studentName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-600" />
              {request.location}, {request.district}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {request.verified && (
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center uppercase tracking-wide">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
            <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-full">
              {request.category}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Needed Items</h4>
          <ul className="space-y-1">
            {request.items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start">
                <span className="text-cyan-500 mr-2 font-bold">•</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
           <p className="text-sm text-gray-600 italic leading-relaxed">"{request.story}"</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
        {request.status === 'open' ? (
          <div className="space-y-2">
            {!showContact ? (
              <button onClick={() => setShowContact(true)} className="w-full bg-cyan-600 text-white py-2.5 rounded-lg hover:bg-cyan-700 transition-colors font-semibold flex items-center justify-center shadow-sm">
                <Eye className="w-4 h-4 mr-2" /> View Contact Info
              </button>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <div className="p-3 bg-white rounded-lg border border-cyan-200 flex justify-between items-center shadow-sm">
                   <div className="flex items-center text-cyan-900 font-medium">
                     <Phone className="w-4 h-4 mr-2" /> {request.phone}
                   </div>
                   <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
                     <EyeOff className="w-4 h-4" />
                   </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={handleWhatsApp} className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center transition-colors text-sm">
                     <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                   </button>
                   <button onClick={handleMarkFulfilled} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors text-sm">
                     <CheckCircle className="w-4 h-4 mr-1" /> Fulfilled
                   </button>
                </div>
              </div>
            )}
          </div>
        ) : (
           <div className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-bold flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" /> Request Fulfilled
           </div>
        )}
      </div>
    </div>
  );
};