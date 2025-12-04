import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHopeHub } from '../contexts/HopeHubContext';
import { Upload, FileText } from 'lucide-react';

const SubmitRequestPage = () => {
  const { addRequest } = useHopeHub();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '', district: '', location: '', category: '', items: '', story: '', phone: '', verificationDoc: null
  });
  const [verificationPreview, setVerificationPreview] = useState(null);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, verificationDoc: file.name }));
      const reader = new FileReader();
      reader.onloadend = () => setVerificationPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => Object.values(formData).every(val => val);
  
  const handleSubmit = () => {
    if (isFormValid()) {
      addRequest({ ...formData, items: formData.items.split(',').map(item => item.trim()), verified: true });
      alert('Your request has been submitted successfully!');
      navigate('/hub-view');
    }
  };

  const districts = ['Gampaha', 'Kalutara', 'Matara', 'Colombo', 'Galle', 'Kandy', 'Kurunegala'];
  const categories = ['Textbooks', 'Uniforms', 'Stationery', 'Shoes', 'Bags', 'Other'];

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-cyan-100 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-cyan-600 p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Submit Your Hope Request</h1>
            <p className="text-cyan-100">Fill out the form below to get help from the community</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">Student Name</label>
                 <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. Kavindi Perera" required />
              </div>
              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">Phone Number</label>
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

            <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700">Need Category</label>
               <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-white outline-none" required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700">Items Needed <span className="text-gray-400 font-normal">(Separate by comma)</span></label>
               <textarea name="items" value={formData.items} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. Grade 10 Science Book, Blue Pen Set" required />
            </div>

            <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700">Your Story <span className="text-gray-400 font-normal">(Why do you need help?)</span></label>
               <textarea name="story" value={formData.story} onChange={handleInputChange} rows="4" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="Explain your situation briefly..." required />
            </div>

            <div className="border-2 border-dashed border-cyan-200 rounded-xl p-6 bg-cyan-50 text-center">
              <label className="block text-sm font-semibold text-cyan-900 mb-3">Verification Document (School ID or Grama Sevaka Letter)</label>
              <div className="relative">
                 <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload" required />
                 <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-cyan-300 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> Upload Document
                 </label>
              </div>
              {verificationPreview && (
                <div className="mt-4 flex flex-col items-center">
                   <p className="text-xs text-green-600 font-bold mb-2 flex items-center"><FileText className="w-3 h-3 mr-1"/> Document Selected</p>
                   <img src={verificationPreview} alt="Preview" className="h-32 object-contain rounded-lg shadow-md border border-gray-200" />
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