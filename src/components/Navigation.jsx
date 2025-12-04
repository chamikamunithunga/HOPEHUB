import React, { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useHopeHub } from '../contexts/HopeHubContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, label, baseColor, activeColor }) => {
    const isActive = currentPath === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`px-4 py-2 rounded-lg transition-colors font-medium block w-full md:w-auto text-center ${
          isActive
            ? `${activeColor} text-white shadow-md`
            : `text-gray-700 hover:${baseColor}`
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/hub-view" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 bg-linear-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent hidden sm:block">
              HopeHub
            </span>
          </Link>

          <div className="hidden md:flex space-x-4">
            <NavLink to="/hub-view" label="Browse Requests" baseColor="bg-cyan-50" activeColor="bg-cyan-600" />
            <NavLink to="/submit" label="Submit Request" baseColor="bg-yellow-50" activeColor="bg-yellow-400 text-gray-900" />
            <NavLink to="/success" label="Success Stories" baseColor="bg-green-50" activeColor="bg-green-600" />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-cyan-600 focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 px-4 pt-2 pb-4 space-y-2">
           <NavLink to="/hub-view" label="Browse Requests" baseColor="bg-cyan-50" activeColor="bg-cyan-600" />
           <NavLink to="/submit" label="Submit Request" baseColor="bg-yellow-50" activeColor="bg-yellow-400" />
           <NavLink to="/success" label="Success Stories" baseColor="bg-green-50" activeColor="bg-green-600" />
        </div>
      )}
    </nav>
  );
};

export default Navigation;