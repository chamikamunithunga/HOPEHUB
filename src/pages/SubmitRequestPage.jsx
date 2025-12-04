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
    <label className="form-label">
       <div className="label-content">
          {Icon && <Icon className="w-3.5 h-3.5 text-cyan-600" />}
          <span>{en}</span>
          <span className="label-si">
            {si}
          </span>
          {required && <span className="req-star">*</span>}
       </div>
    </label>
  );

  const nameLabels = getNameLabelObj();

  return (
    <div className="submit-page">
      <div className="container">
        <div className="card-container">
          
          {/* Header */}
          <div className="form-header">
            <h1>Submit Your Request</h1>
            <p>ඔබේ ඉල්ලීම ඇතුලත් කරන්න</p>
          </div>
          
          <div className="form-body">
            
            {/* User Type Selector */}
            <div className="user-type-grid">
              <button 
                onClick={() => setUserType('student')}
                className={`type-btn ${userType === 'student' ? 'active' : ''}`}
              >
                <GraduationCap /> 
                <div className="flex flex-col md:flex-row md:items-baseline gap-1">
                  <span>Student</span>
                  <span className="opacity-75 font-normal">ශිෂ්‍ය</span>
                </div>
              </button>
              <button 
                onClick={() => setUserType('school')}
                className={`type-btn ${userType === 'school' ? 'active' : ''}`}
              >
                <School /> 
                <div className="flex flex-col md:flex-row md:items-baseline gap-1">
                  <span>School</span>
                  <span className="opacity-75 font-normal">පාසල්</span>
                </div>
              </button>
              <button 
                onClick={() => setUserType('library')}
                className={`type-btn ${userType === 'library' ? 'active' : ''}`}
              >
                <Book /> 
                <div className="flex flex-col md:flex-row md:items-baseline gap-1">
                  <span>Library</span>
                  <span className="opacity-75 font-normal">පුස්තකාල</span>
                </div>
              </button>
            </div>

            <div className="form-layout">
              
              {/* LEFT COLUMN: Details */}
              <div className="form-column">
                
                <div className="input-grid">
                  <div className="input-group">
                     <FormLabel en={nameLabels.en} si={nameLabels.si} required />
                     <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="form-input" placeholder="e.g. Amantha Perera" required />
                  </div>
                  <div className="input-group">
                     <FormLabel en="Contact Number" si="දුරකථන අංකය" required />
                     <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="07XXXXXXXX" required />
                  </div>
                  <div className="input-group">
                     <FormLabel en="District" si="දිස්ත්‍රික්කය" required />
                     <select name="district" value={formData.district} onChange={handleInputChange} className="form-select" required>
                        <option value="">Select / තෝරන්න</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                     </select>
                  </div>
                  <div className="input-group">
                     <FormLabel en="City / Town" si="නගරය / ප්‍රදේශය" required />
                     <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" placeholder="e.g. Kadawatha" required />
                  </div>
                </div>

                {/* Map Section */}
                <div className="input-group" style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1rem' }}>
                    <FormLabel en="Location Map" si="පිහිටීම (සිතියම)" />
                    
                    <div className="map-box">
                        <div className="map-input-area">
                           <div className="flex items-center gap-2" style={{marginBottom: '0.5rem'}}>
                             <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                             <input 
                                 type="url" 
                                 name="mapLink" 
                                 value={formData.mapLink} 
                                 onChange={handleInputChange} 
                                 className="form-input" 
                                 placeholder="Paste Google Maps Link"
                                 style={{ fontSize: '0.75rem', padding: '0.5rem' }} 
                             />
                           </div>
                           <p style={{ fontSize: '0.625rem', color: 'var(--gray-500)', paddingLeft: '1.5rem' }}>
                             Link helps donors find you.<br/>
                             <span style={{ color: 'var(--gray-400)' }}>පරිත්‍යාගශීලීන්ට ඔබව සොයා ගැනීමට උදව් වේ.</span>
                           </p>
                        </div>
                        
                        <div className="map-preview">
                            <div className="map-placeholder">
                                <span>Map Preview</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Needed */}
                <div className="input-group">
                   <FormLabel en="Items Needed" si="අවශ්‍ය ද්‍රව්‍ය" icon={Package} required />
                   
                   <div className="items-container">
                      <div className="tags-wrapper">
                        {formData.items.map((item, index) => (
                          <span key={index} className="item-tag">
                            {item}
                            <button onClick={() => removeItem(item)} className="remove-tag">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="tag-input-wrapper">
                        <input 
                            type="text" 
                            value={currentItem} 
                            onChange={(e) => setCurrentItem(e.target.value)}
                            onKeyDown={handleItemKeyDown}
                            className="tag-input" 
                            placeholder={formData.items.length === 0 ? "Type item & Press Enter (e.g. Books)" : "Add another..."} 
                        />
                        <button 
                             onClick={(e) => {
                                const event = { key: 'Enter', preventDefault: () => {} };
                                handleItemKeyDown(event);
                             }}
                             className="add-tag-btn"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                   <p style={{ fontSize: '0.625rem', color: 'var(--gray-500)', textAlign: 'right', marginTop: '0.25rem' }}>Press Enter to add item</p>
                </div>
              </div>

              {/* RIGHT COLUMN: Story & Uploads */}
              <div className="form-column" style={{ display: 'flex', flexDirection: 'column' }}>
                
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                   <FormLabel en="Description / Story" si="විස්තරය" required />
                   <textarea 
                    name="story" 
                    value={formData.story} 
                    onChange={handleInputChange} 
                    rows="6" 
                    className="form-textarea" 
                    placeholder={userType === 'student' ? "Describe the situation... (තත්වය විස්තර කරන්න)" : "Describe damage... (හානිය විස්තර කරන්න)"} 
                    required 
                    style={{ resize: 'none' }}
                   />
                </div>

                <div style={{ flex: 1, minHeight: '220px', marginBottom: '1.5rem' }}>
                  {userType === 'student' ? (
                    <div className="upload-area danger">
                       <div className="text-center" style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#7f1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <AlertTriangle className="w-4 h-4" />
                            <span>Proof of Disaster</span>
                            <span style={{ fontWeight: '400', opacity: 0.75, fontSize: '0.75rem' }}>(ආපදා හානි ඡායාරූප)</span>
                          </label>
                          <p style={{ fontSize: '0.625rem', color: '#dc2626' }}>Required for verification / තහවුරු කිරීම සඳහා අනිවාර්ය වේ</p>
                       </div>
                      
                       <div className="image-grid">
                          {formData.disasterImages.map((img, index) => (
                            <div key={index} className="img-preview">
                               <img src={img} alt={`Evidence ${index + 1}`} />
                               <button onClick={() => removeImage(index)} className="remove-img">
                                 <X className="w-3 h-3 text-red-600" />
                               </button>
                            </div>
                          ))}
                          
                          <div className="add-img-btn">
                             <input type="file" accept="image/*" multiple onChange={handleDisasterUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                             <Plus className="w-6 h-6 text-red-300" style={{ marginBottom: '0.25rem' }} />
                             <span style={{ fontSize: '0.625rem', fontWeight: '600', color: '#f87171' }}>Add</span>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="upload-area info">
                      <div className="flex flex-col items-center" style={{ marginBottom: '0.5rem' }}>
                        <FileText className="w-6 h-6 text-cyan-700" style={{ marginBottom: '0.5rem' }} />
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#164e63' }}>Official Verification</h3>
                        <p style={{ fontSize: '0.75rem', color: '#0e7490' }}>නිල තහවුරු කිරීම (අනිවාර්ය වේ)</p>
                      </div>
                      
                      <p style={{ fontSize: '0.75rem', color: '#0891b2', marginBottom: '1.25rem', textAlign: 'center' }}>Upload Letterhead or Registration Certificate<br/>(ලිපි ශීර්ෂය හෝ ලියාපදිංචි සහතිකය)</p>
                      
                      <div className="relative">
                         <input type="file" accept="image/*,.pdf" onChange={handleVerificationUpload} style={{ display: 'none' }} id="verify-upload" required />
                         <label htmlFor="verify-upload" className="view-btn" style={{ background: 'white', width: 'auto', padding: '0.625rem 1.25rem' }}>
                            <Upload className="w-4 h-4 mr-2" /> Upload Document
                         </label>
                      </div>
                      {verificationPreview && (
                        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '200px', display: 'flex', justifyContent: 'center' }}>
                           <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              <FileText className="w-5 h-5 text-cyan-600" />
                              <span style={{ fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formData.verificationDoc}</span>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={!isFormValid()} 
                    className={`submit-btn ${isFormValid() ? 'active' : 'disabled'}`}
                >
                  <span>Submit Request</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8, marginTop: '0.125rem' }}>ඉල්ලීම යොමු කරන්න</span>
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