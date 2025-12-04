import React from 'react';
import { Search, MapPin, CheckCircle, GraduationCap, School, Book, ArrowRight } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

export const FilterBar = () => {
  const {
    selectedDistrict, setSelectedDistrict,
    searchQuery, setSearchQuery
  } = useHopeHub();

  const districts = ['all', 'Gampaha', 'Kalutara', 'Matara', 'Colombo', 'Galle'];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 py-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, location, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none transition-all"
            />
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-600 bg-white outline-none cursor-pointer"
          >
            {districts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Districts' : d}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export const RequestCard = ({ request, onViewClick }) => {
  
  const getUserTypeStyle = () => {
    switch (request.userType) {
        case 'school':
            return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'School', icon: <School className="w-3 h-3 mr-1" /> };
        case 'library':
            return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Library', icon: <Book className="w-3 h-3 mr-1" /> };
        default: 
            return { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Student', icon: <GraduationCap className="w-3 h-3 mr-1" /> };
    }
  };

  const typeStyle = getUserTypeStyle();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <div className="p-6 flex-1 relative">
        <div className="flex justify-between items-start mb-3">
            <span className={`${typeStyle.bg} ${typeStyle.text} text-[10px] font-bold px-3 py-1 rounded-full flex items-center uppercase tracking-wide`}>
                {typeStyle.icon} {typeStyle.label}
            </span>

            {request.verified && (
              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center border border-green-100">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
        </div>

        <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-cyan-700 transition-colors">{request.studentName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {request.location}, {request.district}
            </div>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Needs Support For:</h4>
          <div className="flex flex-wrap gap-2">
            {request.items.slice(0, 3).map((item, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium border border-gray-200">
                {item}
              </span>
            ))}
            {request.items.length > 3 && <span className="text-xs text-gray-400 flex items-center">+{request.items.length - 3} more</span>}
          </div>
        </div>

        <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">"{request.story}"</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
         <button 
            onClick={() => onViewClick(request)} 
            className="w-full bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-600 hover:text-white py-2.5 rounded-lg transition-all font-semibold flex items-center justify-center shadow-xs hover:shadow-md cursor-pointer"
         >
            View Details & Donate <ArrowRight className="w-4 h-4 ml-2" />
         </button>
      </div>
    </div>
  );
};