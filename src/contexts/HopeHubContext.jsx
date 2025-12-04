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
      userType: 'student',
      studentName: "Kavindi Perera",
      district: "Gampaha",
      location: "Kadawatha",
      items: ["Grade 10 Science Textbook", "Shoes"],
      story: "Our home was flooded. I lost my books.",
      phone: "0771234567",
      status: "open",
      verified: true,
      // These arrays are REQUIRED for the modal to work
      disasterImages: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80"], 
      donations: [
        { donor: "Mr. Amal", items: "Shoes", contact: "0711111111" }
      ],
      datePosted: "2025-12-01"
    },
    {
      id: 2,
      userType: 'school',
      studentName: "Vidyaloka Maha Vidyalaya",
      district: "Kalutara",
      location: "Panadura",
      items: ["50 Chairs", "Whiteboard"],
      story: "Three classrooms were damaged by the landslide.",
      phone: "0342222222",
      status: "open",
      verified: true,
      verificationDoc: "letterhead.jpg",
      disasterImages: [],
      donations: [],
      datePosted: "2025-12-02"
    },
    {
      id: 3,
      userType: 'library',
      studentName: "Public Library Weligama",
      district: "Matara",
      location: "Weligama",
      items: ["Bookshelves", "Children's Books"],
      story: "The ground floor was submerged. We need help restoring the children's section.",
      phone: "0412223333",
      status: "open",
      verified: true,
      verificationDoc: "reg_cert.jpg",
      disasterImages: [],
      donations: [
         { donor: "Book Club Colombo", items: "50 Story Books", contact: "0112345678" }
      ],
      datePosted: "2025-11-28"
    }
  ]);

  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: requests.length + 1,
      donations: [],
      status: 'open',
      datePosted: new Date().toISOString().split('T')[0]
    };
    setRequests([...requests, newRequest]);
  };

  const addDonation = (requestId, donationData) => {
    setRequests(requests.map(req => {
        if (req.id === requestId) {
            return { ...req, donations: [...req.donations, donationData] };
        }
        return req;
    }));
  };

  const updateRequestStatus = (id, status) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    const matchesDistrict = selectedDistrict === 'all' || req.district === selectedDistrict;
    const matchesSearch = searchQuery === '' || 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
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
      addDonation,
      updateRequestStatus
    }}>
      {children}
    </HopeHubContext.Provider>
  );
};