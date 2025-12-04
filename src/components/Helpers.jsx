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
    <div className="filter-bar">
      <div className="search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, location, or items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="district-select-wrapper">
          <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="form-select"
              style={{ cursor: 'pointer' }}
          >
              {districts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Districts' : d}</option>)}
          </select>
      </div>
    </div>
  );
};

export const RequestCard = ({ request, onViewClick }) => {
  
  const getUserTypeConfig = () => {
    switch (request.userType) {
        case 'school':
            return { className: 'badge school', label: 'School', icon: <School className="w-3 h-3 mr-1" /> };
        case 'library':
            return { className: 'badge library', label: 'Library', icon: <Book className="w-3 h-3 mr-1" /> };
        default: 
            return { className: 'badge student', label: 'Student', icon: <GraduationCap className="w-3 h-3 mr-1" /> };
    }
  };

  const typeConfig = getUserTypeConfig();

  return (
    <div className="req-card">
      <div className="card-body">
        <div className="card-top">
            <span className={typeConfig.className}>
                {typeConfig.icon} {typeConfig.label}
            </span>

            {request.verified && (
              <span className="badge verified">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </span>
            )}
        </div>

        <div>
            <h3 className="card-title">{request.studentName}</h3>
            <div className="card-loc">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {request.location}, {request.district}
            </div>
        </div>

        <div className="needs-section">
          <h4 className="needs-title">Needs Support For:</h4>
          <div className="tags-list">
            {request.items.slice(0, 3).map((item, idx) => (
              <span key={idx} className="item-pill">
                {item}
              </span>
            ))}
            {request.items.length > 3 && <span className="item-pill" style={{background: 'transparent', border: 'none'}}>+{request.items.length - 3} more</span>}
          </div>
        </div>

        <div className="mt-4">
            <p className="story-preview">"{request.story}"</p>
        </div>
      </div>

      <div className="card-footer">
         <button 
           onClick={() => onViewClick(request)} 
           className="view-btn"
         >
           View Details & Donate <ArrowRight className="w-4 h-4 ml-2" />
         </button>
      </div>
    </div>
  );
};