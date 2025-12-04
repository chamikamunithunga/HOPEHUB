import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHopeHub } from '../contexts/HopeHubContext';
import { Upload, FileText, GraduationCap, School, Book, AlertTriangle, X, Plus, MapPin, Link as LinkIcon, Package } from 'lucide-react';

const SubmitRequestPage = () => {
  const { addRequest } = useHopeHub();
  const navigate = useNavigate();

  const [userType, setUserType] = useState('student'); 
  const [currentItem, setCurrentItem] = useState('');

  const [formData, setFormData] = useState({
    studentName: '', 
    district: '', 
    location: '', 
    items: [],  
    story: '', 
    phone: '', 
    mapLink: '', 
    verificationDoc: null,
    disasterImages: [] 
  });

  const [verificationPreview, setVerificationPreview] = useState(null);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleItemKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedItem = currentItem.trim();
      
      if (trimmedItem && !formData.items.includes(trimmedItem)) {
        setFormData(prev => ({
          ...prev,
          items: [...prev.items, trimmedItem]
        }));
        setCurrentItem('');  
      }
    }
  };

  const removeItem = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item !== itemToRemove)
    }));
  };

  const handleVerificationUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, verificationDoc: file.name }));
      const reader = new FileReader();
      reader.onloadend = () => setVerificationPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDisasterUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        disasterImages: [...prev.disasterImages, ...newImageUrls]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      disasterImages: prev.disasterImages.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    const basicFields = formData.studentName && formData.district && formData.location && formData.items.length > 0 && formData.story && formData.phone;
    
    if (userType === 'student') {
        return basicFields && formData.disasterImages.length > 0;
    } else {
        return basicFields && formData.verificationDoc;
    }
  };
  
  const handleSubmit = () => {
    if (isFormValid()) {
      addRequest({ 
        ...formData, 
        userType, 
        items: formData.items, 
        verified: true,
        disasterImage: formData.disasterImages.length > 0 ? formData.disasterImages[0] : null
      });
      alert('Your request has been submitted successfully!');
      navigate('/hub-view');
    }
  };

  const districts = ['Gampaha', 'Kalutara', 'Matara', 'Colombo', 'Galle', 'Kandy', 'Kurunegala'];

  const getNameLabel = () => {
    if (userType === 'school') return 'School Name';
    if (userType === 'library') return 'Library Name';
    return 'Student Name';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-cyan-100 py-6 md:py-10">
      {/* Increased max-width for laptop view */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-cyan-600 p-5 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Submit Your Hope Request</h1>
            <p className="text-cyan-100 text-sm">Let us know who needs help</p>
          </div>
          
          <div className="p-5 md:p-8">
            
            {/* User Type Selector - Full Width */}
            <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 rounded-xl mb-6 max-w-2xl mx-auto lg:mx-0">
              <button 
                onClick={() => setUserType('student')}
                className={`flex flex-col md:flex-row items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold transition-all ${userType === 'student' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <GraduationCap className="w-4 h-4 md:mr-2 mb-1 md:mb-0" /> Student
              </button>
              <button 
                onClick={() => setUserType('school')}
                className={`flex flex-col md:flex-row items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold transition-all ${userType === 'school' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <School className="w-4 h-4 md:mr-2 mb-1 md:mb-0" /> School
              </button>
              <button 
                onClick={() => setUserType('library')}
                className={`flex flex-col md:flex-row items-center justify-center py-2 px-4 rounded-lg text-sm font-semibold transition-all ${userType === 'library' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Book className="w-4 h-4 md:mr-2 mb-1 md:mb-0" /> Library
              </button>
            </div>

            {/* Split Layout for Desktop: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Data Entry */}
              <div className="space-y-5">
                
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{getNameLabel()}</label>
                     <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm" placeholder={`Enter ${getNameLabel()}`} required />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Contact Number</label>
                     <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm" placeholder="07XXXXXXXX" required />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">District</label>
                     <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white outline-none text-sm" required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">City / Town</label>
                     <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm" placeholder="e.g. Kadawatha" required />
                  </div>
                </div>

                {/* Map Section */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
                        <span>Location Map <span className="text-gray-400 font-normal normal-case ml-1">(Optional)</span></span>
                    </label>
                    
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 flex gap-4 h-28">
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                              <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                              <input 
                                  type="url" 
                                  name="mapLink" 
                                  value={formData.mapLink} 
                                  onChange={handleInputChange} 
                                  className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-cyan-500 outline-none text-xs" 
                                  placeholder="Paste Google Maps Link" 
                              />
                           </div>
                           <p className="text-[10px] text-gray-500 leading-tight pl-6">Pasting a link helps donors find you easily for delivery.</p>
                        </div>
                        
                        <div className="relative w-32 h-full rounded-md overflow-hidden border border-gray-300 shadow-inner shrink-0 hidden sm:block">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58638668784!2d79.8211862566165!3d6.921833481635678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                                width="100%" 
                                height="100%" 
                                style={{border:0}} 
                                allowFullScreen="" 
                                loading="lazy" 
                                title="Dummy Map Location"
                                className="opacity-80"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Items Needed */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center">
                      <Package className="w-3.5 h-3.5 mr-1.5 text-cyan-600" /> 
                      Items Needed 
                   </label>
                   
                   <div className="bg-white border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-cyan-500 transition-all min-h-[100px]">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.items.map((item, index) => (
                          <span key={index} className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-md flex items-center">
                            {item}
                            <button onClick={() => removeItem(item)} className="ml-1 hover:bg-cyan-200 rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <input 
                            type="text" 
                            value={currentItem} 
                            onChange={(e) => setCurrentItem(e.target.value)}
                            onKeyDown={handleItemKeyDown}
                            className="w-full px-2 py-1 outline-none text-sm" 
                            placeholder={formData.items.length === 0 ? "Type item & Press Enter..." : "Add another..."} 
                        />
                        <button 
                             onClick={(e) => {
                                const event = { key: 'Enter', preventDefault: () => {} };
                                handleItemKeyDown(event);
                             }}
                             className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-cyan-600"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Story & Uploads */}
              <div className="flex flex-col h-full">
                
                <div className="space-y-1 mb-6">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description / Story</label>
                   <textarea name="story" value={formData.story} onChange={handleInputChange} rows="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm resize-none" placeholder={userType === 'student' ? "Describe the disaster situation and how it affected your studies..." : "Describe the damage to your institution..."} required />
                </div>

                {/* Upload Section - Takes remaining space */}
                <div className="flex-1 min-h-[200px] mb-6">
                  {userType === 'student' ? (
                    <div className="border-2 border-dashed border-red-200 rounded-xl p-5 bg-red-50 h-full flex flex-col">
                       <div className="text-center mb-4">
                          <label className="text-sm font-bold text-red-900 mb-1 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Proof of Disaster (Required)
                          </label>
                          <p className="text-[10px] text-red-600">Upload photos of the damage</p>
                       </div>
                      
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {formData.disasterImages.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-red-200 group">
                               <img src={img} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                               <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100">
                                 <X className="w-3 h-3 text-red-600" />
                               </button>
                            </div>
                          ))}
                          
                          <div className="relative aspect-square rounded-lg border-2 border-dashed border-red-300 bg-white hover:bg-red-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                             <input type="file" accept="image/*" multiple onChange={handleDisasterUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                             <Plus className="w-5 h-5 text-red-400 mb-1" />
                             <span className="text-[10px] font-semibold text-red-400">Add</span>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-cyan-200 rounded-xl p-6 bg-cyan-50 text-center h-full flex flex-col justify-center items-center">
                      <label className="flex text-sm font-bold text-cyan-900 mb-2 items-center justify-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Official Verification (Required)
                      </label>
                      <p className="text-xs text-cyan-600 mb-4">Upload letterhead or Registration Certificate</p>
                      
                      <div className="relative">
                         <input type="file" accept="image/*,.pdf" onChange={handleVerificationUpload} className="hidden" id="verify-upload" required />
                         <label htmlFor="verify-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-cyan-300 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
                            <Upload className="w-4 h-4 mr-2" /> Upload Document
                         </label>
                      </div>
                      {verificationPreview && (
                        <div className="mt-4 flex flex-col items-center animate-fadeIn">
                           <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm mb-1">
                              <FileText className="w-6 h-6 text-cyan-600" />
                           </div>
                           <p className="text-[10px] text-gray-500">{formData.verificationDoc}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={handleSubmit} disabled={!isFormValid()} className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 mt-auto ${isFormValid() ? 'bg-linear-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  Submit Request
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequestPage;