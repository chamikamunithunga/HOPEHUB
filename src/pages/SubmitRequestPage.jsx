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
        // items is already an array now, so no need to split
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
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-cyan-100 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="bg-cyan-600 p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Submit Your Hope Request</h1>
            <p className="text-cyan-100">Let us know who needs help</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">

            {/* User Type Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
              <button 
                onClick={() => setUserType('student')}
                className={`flex flex-col md:flex-row items-center justify-center py-3 px-2 rounded-lg text-sm font-semibold transition-all ${userType === 'student' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <GraduationCap className="w-5 h-5 md:mr-2 mb-1 md:mb-0" /> Student
              </button>
              <button 
                onClick={() => setUserType('school')}
                className={`flex flex-col md:flex-row items-center justify-center py-3 px-2 rounded-lg text-sm font-semibold transition-all ${userType === 'school' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <School className="w-5 h-5 md:mr-2 mb-1 md:mb-0" /> School
              </button>
              <button 
                onClick={() => setUserType('library')}
                className={`flex flex-col md:flex-row items-center justify-center py-3 px-2 rounded-lg text-sm font-semibold transition-all ${userType === 'library' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Book className="w-5 h-5 md:mr-2 mb-1 md:mb-0" /> Library
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">{getNameLabel()}</label>
                 <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder={`Enter ${getNameLabel()}`} required />
              </div>
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                 <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="07XXXXXXXX" required />
              </div>
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">District</label>
                 <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white outline-none" required>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">City / Town</label>
                 <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. Kadawatha" required />
              </div>
            </div>

            {/* Optional Map Section */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                    <span>Location Map <span className="text-gray-400 font-normal ml-1">(Optional)</span></span>
                    <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">Paste Link & Verify</span>
                </label>
                
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <input 
                            type="url" 
                            name="mapLink" 
                            value={formData.mapLink} 
                            onChange={handleInputChange} 
                            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm" 
                            placeholder="Paste Google Maps Link here..." 
                        />
                    </div>
                    
                    <div className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58638668784!2d79.8211862566165!3d6.921833481635678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            allowFullScreen="" 
                            loading="lazy" 
                            title="Dummy Map Location"
                            className="opacity-80 hover:opacity-100 transition-opacity"
                        ></iframe>
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-600 shadow-sm pointer-events-none flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-red-500" /> Preview (Dummy Location)
                        </div>
                    </div>
                </div>
            </div>

            {/* --- UPDATED: Items Needed (Point Wise) --- */}
            <div className="space-y-2">
               <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Package className="w-4 h-4 mr-1.5 text-cyan-600" /> 
                  Items Needed 
               </label>
               
               <div className="bg-white border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
                  
                  {/* Visual List of Items */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.items.map((item, index) => (
                      <span key={index} className="bg-cyan-100 text-cyan-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center animate-fadeIn">
                        {item}
                        <button onClick={() => removeItem(item)} className="ml-2 hover:bg-cyan-200 rounded-full p-0.5 transition-colors">
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
                        placeholder={formData.items.length === 0 ? "Type an item and press Enter..." : "Add another item..."} 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button 
                          onClick={(e) => {
                             // Allow manual click of plus button to add
                             const event = { key: 'Enter', preventDefault: () => {} };
                             handleItemKeyDown(event);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 p-1 rounded-md text-gray-500"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
               </div>
               <p className="text-xs text-gray-500 text-right">Press <span className="font-bold">Enter</span> to add an item</p>
            </div>
            {/* ------------------------------------------ */}

            <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700">Description / Story</label>
               <textarea name="story" value={formData.story} onChange={handleInputChange} rows="4" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder={userType === 'student' ? "Describe the disaster situation and how it affected your studies..." : "Describe the damage to your institution and what is urgently needed..."} required />
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 gap-6">
              
              {userType === 'student' && (
                <div className="border-2 border-dashed border-red-200 rounded-xl p-6 bg-red-50">
                   <div className="text-center mb-4">
                      <label className="text-sm font-bold text-red-900 mb-2 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Proof of Disaster (Required)
                      </label>
                      <p className="text-xs text-red-600">Please upload photos of the damage (flooded house, damaged books, etc.)</p>
                   </div>
                  
                   <div className="grid grid-cols-3 gap-4 mb-4">
                      {formData.disasterImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-red-200 group">
                           <img src={img} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => removeImage(index)}
                             className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                           >
                             <X className="w-3 h-3 text-red-600" />
                           </button>
                        </div>
                      ))}
                      
                      <div className="relative aspect-square rounded-lg border-2 border-dashed border-red-300 bg-white hover:bg-red-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                         <input 
                           type="file" 
                           accept="image/*" 
                           multiple 
                           onChange={handleDisasterUpload} 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                           id="disaster-upload" 
                         />
                         <Plus className="w-6 h-6 text-red-400 mb-1" />
                         <span className="text-xs font-semibold text-red-400">Add Photos</span>
                      </div>
                   </div>
                   
                   {formData.disasterImages.length === 0 && (
                      <p className="text-center text-xs text-red-400 italic">No photos added yet</p>
                   )}
                </div>
              )}

              {(userType === 'school' || userType === 'library') && (
                <div className="border-2 border-dashed border-cyan-200 rounded-xl p-6 bg-cyan-50 text-center">
                  <label className="flex text-sm font-bold text-cyan-900 mb-2 items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Official Verification (Required)
                  </label>
                  <p className="text-xs text-cyan-600 mb-4">Upload an official request letter on letterhead or Registration Certificate</p>
                  
                  <div className="relative">
                     <input type="file" accept="image/*,.pdf" onChange={handleVerificationUpload} className="hidden" id="verify-upload" required />
                     <label htmlFor="verify-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-cyan-300 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
                        <Upload className="w-4 h-4 mr-2" /> Upload Document
                     </label>
                  </div>
                  {verificationPreview && (
                    <div className="mt-4 flex flex-col items-center animate-fadeIn">
                       <p className="text-xs text-green-600 font-bold mb-2">Document Attached</p>
                       <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <FileText className="w-8 h-8 text-cyan-600" />
                       </div>
                       <p className="text-[10px] text-gray-500 mt-1">{formData.verificationDoc}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={!isFormValid()} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 ${isFormValid() ? 'bg-linear-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequestPage;