import React, { useState } from 'react';
import { useHopeHub } from '../contexts/HopeHubContext';
import { Upload, FileText, GraduationCap, School, Book, AlertTriangle, X, Plus, Link as LinkIcon, Package } from 'lucide-react';

const SubmitRequestPage = () => {
  const { addRequest, setCurrentPage } = useHopeHub();

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
      
      setFormData({
        studentName: '', district: '', location: '', items: [], story: '', phone: '', mapLink: '', verificationDoc: null, disasterImages: [] 
      });
      setVerificationPreview(null);

      const homeSection = document.getElementById('home');
      if (homeSection) homeSection.scrollIntoView({ behavior: 'smooth' });
      
      setCurrentPage('home');
    }
  };

  const districts = ['Gampaha', 'Kalutara', 'Matara', 'Colombo', 'Galle', 'Kandy', 'Kurunegala'];

  const getNameLabelObj = () => {
    if (userType === 'school') return { en: 'School Name', si: 'පාසලේ නම' };
    if (userType === 'library') return { en: 'Library Name', si: 'පුස්තකාලයේ නම' };
    return { en: 'Student Name', si: 'සිසු නාමය' };
  };

  const FormLabel = ({ en, si, icon: Icon, required = false }) => (
    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
       <div className="flex items-center flex-wrap gap-1">
          {Icon && <Icon className="w-3.5 h-3.5 text-cyan-600 mr-0.5" />}
          <span>{en}</span>
          <span className="text-gray-500 font-medium normal-case text-[11px] font-sans tracking-normal">
            {si}
          </span>
          {required && <span className="text-red-500 ml-auto md:ml-1">*</span>}
       </div>
    </label>
  );

  const nameLabels = getNameLabelObj();

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-cyan-100 py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-cyan-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Submit Your Request</h1>
            <p className="text-cyan-100 font-medium">ඔබේ ඉල්ලීම ඇතුලත් කරන්න</p>
          </div>
          
          <div className="p-5 md:p-8">
            
            {/* User Type Selector */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-1.5 bg-gray-100 rounded-xl mb-8 max-w-2xl mx-auto lg:mx-0">
              <button 
                onClick={() => setUserType('student')}
                className={`flex flex-col sm:flex-row items-center justify-center py-2.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${userType === 'student' ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <GraduationCap className="w-5 h-5 sm:mr-2 mb-1 sm:mb-0" /> 
                <div className="text-center sm:text-left">
                  <span className="block">Student</span>
                  <span className="block text-[10px] font-normal opacity-75">ශිෂ්‍ය</span>
                </div>
              </button>
              <button 
                onClick={() => setUserType('school')}
                className={`flex flex-col sm:flex-row items-center justify-center py-2.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${userType === 'school' ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <School className="w-5 h-5 sm:mr-2 mb-1 sm:mb-0" /> 
                <div className="text-center sm:text-left">
                  <span className="block">School</span>
                  <span className="block text-[10px] font-normal opacity-75">පාසල්</span>
                </div>
              </button>
              <button 
                onClick={() => setUserType('library')}
                className={`flex flex-col sm:flex-row items-center justify-center py-2.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${userType === 'library' ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Book className="w-5 h-5 sm:mr-2 mb-1 sm:mb-0" /> 
                <div className="text-center sm:text-left">
                  <span className="block">Library</span>
                  <span className="block text-[10px] font-normal opacity-75">පුස්තකාල</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Details */}
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                     <FormLabel en={nameLabels.en} si={nameLabels.si} required />
                     <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-shadow" placeholder="e.g. Amantha Perera" required />
                  </div>
                  <div className="space-y-1">
                     <FormLabel en="Contact Number" si="දුරකථන අංකය" required />
                     <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-shadow" placeholder="07XXXXXXXX" required />
                  </div>
                  <div className="space-y-1">
                     <FormLabel en="District" si="දිස්ත්‍රික්කය" required />
                     <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white outline-none text-sm transition-shadow cursor-pointer" required>
                        <option value="">Select / තෝරන්න</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <FormLabel en="City / Town" si="නගරය / ප්‍රදේශය" required />
                     <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-shadow" placeholder="e.g. Kadawatha" required />
                  </div>
                </div>

                {/* Map Section */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <FormLabel en="Location Map" si="පිහිටීම (සිතියම)" />
                    
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-3">
                           <div className="flex items-center gap-2">
                             <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                             <input 
                                 type="url" 
                                 name="mapLink" 
                                 value={formData.mapLink} 
                                 onChange={handleInputChange} 
                                 className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-cyan-500 outline-none text-xs" 
                                 placeholder="Paste Google Maps Link" 
                             />
                           </div>
                           <p className="text-[10px] text-gray-500 leading-tight pl-6">
                             Link helps donors find you.<br/>
                             <span className="text-gray-400">පරිත්‍යාගශීලීන්ට ඔබව සොයා ගැනීමට උදව් වේ.</span>
                           </p>
                        </div>
                        
                        <div className="relative w-full sm:w-32 h-24 rounded-md overflow-hidden border border-gray-300 shadow-inner shrink-0 bg-gray-200">
                            {/* Visual placeholder for map */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <span className="text-[10px]">Map Preview</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Needed */}
                <div className="space-y-2">
                   <FormLabel en="Items Needed" si="අවශ්‍ය ද්‍රව්‍ය" icon={Package} required />
                   
                   <div className="bg-white border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-cyan-500 transition-all min-h-[120px] shadow-inner">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.items.map((item, index) => (
                          <span key={index} className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center shadow-sm">
                            {item}
                            <button onClick={() => removeItem(item)} className="ml-1.5 hover:bg-cyan-200 rounded-full p-0.5 transition-colors">
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
                            className="w-full px-2 py-1 outline-none text-sm placeholder:text-gray-400" 
                            placeholder={formData.items.length === 0 ? "Type item & Press Enter (e.g. Books)" : "Add another..."} 
                        />
                        <button 
                             onClick={(e) => {
                                const event = { key: 'Enter', preventDefault: () => {} };
                                handleItemKeyDown(event);
                             }}
                             className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 rounded-md text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                   <p className="text-[10px] text-gray-500 text-right">Press Enter to add item</p>
                </div>
              </div>

              {/* RIGHT COLUMN: Story & Uploads */}
              <div className="flex flex-col h-full">
                
                <div className="space-y-1 mb-6">
                   <FormLabel en="Description / Story" si="විස්තරය" required />
                   <textarea 
                    name="story" 
                    value={formData.story} 
                    onChange={handleInputChange} 
                    rows="6" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm resize-none shadow-sm transition-shadow" 
                    placeholder={userType === 'student' ? "Describe the situation... (තත්වය විස්තර කරන්න)" : "Describe damage... (හානිය විස්තර කරන්න)"} 
                    required 
                   />
                </div>

                <div className="flex-1 min-h-[220px] mb-6">
                  {userType === 'student' ? (
                    <div className="border-2 border-dashed border-red-200 rounded-xl p-5 bg-red-50 h-full flex flex-col transition-colors hover:bg-red-50/80">
                       <div className="text-center mb-4">
                          <label className="text-sm font-bold text-red-900 mb-1 flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Proof of Disaster</span>
                            <span className="font-normal opacity-75 text-xs">(ආපදා හානි ඡායාරූප)</span>
                          </label>
                          <p className="text-[10px] text-red-600">Required for verification / තහවුරු කිරීම සඳහා අනිවාර්ය වේ</p>
                       </div>
                      
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {formData.disasterImages.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-red-200 group shadow-sm">
                               <img src={img} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                               <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors">
                                 <X className="w-3 h-3 text-red-600" />
                               </button>
                            </div>
                          ))}
                          
                          <div className="relative aspect-square rounded-lg border-2 border-dashed border-red-300 bg-white hover:bg-red-50 transition-all flex flex-col items-center justify-center cursor-pointer hover:border-red-400 group">
                             <input type="file" accept="image/*" multiple onChange={handleDisasterUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                             <Plus className="w-6 h-6 text-red-300 group-hover:text-red-500 mb-1 transition-colors" />
                             <span className="text-[10px] font-semibold text-red-400 group-hover:text-red-600">Add</span>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-cyan-200 rounded-xl p-6 bg-cyan-50 text-center h-full flex flex-col justify-center items-center hover:bg-cyan-50/80 transition-colors">
                      <div className="flex flex-col items-center mb-2">
                        <FileText className="w-6 h-6 text-cyan-700 mb-2" />
                        <h3 className="text-sm font-bold text-cyan-900">Official Verification</h3>
                        <p className="text-xs text-cyan-700">නිල තහවුරු කිරීම (අනිවාර්ය වේ)</p>
                      </div>
                      
                      <p className="text-xs text-cyan-600 mb-5 px-4">Upload Letterhead or Registration Certificate<br/>(ලිපි ශීර්ෂය හෝ ලියාපදිංචි සහතිකය)</p>
                      
                      <div className="relative">
                         <input type="file" accept="image/*,.pdf" onChange={handleVerificationUpload} className="hidden" id="verify-upload" required />
                         <label htmlFor="verify-upload" className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-white border border-cyan-300 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-100 hover:border-cyan-400 transition-all shadow-sm text-sm">
                            <Upload className="w-4 h-4 mr-2" /> Upload Document
                         </label>
                      </div>
                      {verificationPreview && (
                        <div className="mt-4 flex flex-col items-center animate-fadeIn w-full max-w-[200px]">
                           <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-1 w-full flex items-center justify-center gap-2">
                              <FileText className="w-5 h-5 text-cyan-600" />
                              <span className="text-xs text-gray-600 truncate">{formData.verificationDoc}</span>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={!isFormValid()} 
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 mt-auto flex flex-col items-center justify-center leading-tight
                    ${isFormValid() ? 'bg-linear-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800 shadow-cyan-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <span>Submit Request</span>
                  <span className="text-xs font-normal opacity-80 mt-0.5">ඉල්ලීම යොමු කරන්න</span>
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