import React, { useState, createContext, useContext } from 'react';

const HopeHubContext = createContext();

export const useHopeHub = () => {
  const context = useContext(HopeHubContext);
  if (!context) throw new Error('useHopeHub must be used within HopeHubProvider');
  return context;
};

export const HopeHubProvider = ({ children }) => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: "Kavindi Perera",
      district: "Gampaha",
      location: "Kadawatha",
      category: "Textbooks",
      items: ["Grade 10 Science Textbook", "Grade 10 Mathematics Textbook"],
      story: "Our home was flooded and all my textbooks were damaged. I have my O/L exam next year.",
      phone: "0771234567",
      status: "open",
      verified: true,
      verificationDoc: "school_letter.jpg",
      datePosted: "2025-12-01"
    },
    {
      id: 2,
      studentName: "Sahan Silva",
      district: "Kalutara",
      location: "Panadura",
      category: "Uniforms",
      items: ["School Uniform (Size 32)", "School Shoes (Size 8)"],
      story: "Flood waters destroyed our belongings. I need a uniform to continue my studies.",
      phone: "0767654321",
      status: "open",
      verified: true,
      verificationDoc: "damage_photo.jpg",
      datePosted: "2025-12-02"
    },
    {
      id: 3,
      studentName: "Nethmi Fernando",
      district: "Matara",
      location: "Weligama",
      category: "Stationery",
      items: ["Exercise Books (10 units)", "Pens and Pencils Set", "Geometry Box"],
      story: "Lost all school supplies in the recent floods. Need stationery to prepare for final exams.",
      phone: "0754567890",
      status: "fulfilled",
      verified: true,
      verificationDoc: "book_list.jpg",
      datePosted: "2025-11-28"
    }
  ]);

  // Removed currentPage state
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: requests.length + 1,
      status: 'open',
      datePosted: new Date().toISOString().split('T')[0]
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequestStatus = (id, status) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    const matchesDistrict = selectedDistrict === 'all' || req.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <HopeHubContext.Provider value={{
      requests,
      filteredRequests,
      selectedDistrict,
      setSelectedDistrict,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      addRequest,
      updateRequestStatus
    }}>
      {children}
    </HopeHubContext.Provider>
  );
};