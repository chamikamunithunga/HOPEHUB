import React, { useState } from 'react';
import { X, MapPin, Phone, GraduationCap, School, Book, Send, User, Gift } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

const DonationModal = ({ request, onClose }) => {
  const { addDonation } = useHopeHub();
  const [donationForm, setDonationForm] = useState({ name: '', phone: '', items: '' });

  if (!request) return null;

  const handleDonate = (e) => {
    e.preventDefault();
    if (donationForm.name && donationForm.items) {
      addDonation(request.id, {
        donor: donationForm.name,
        contact: donationForm.phone,
        items: donationForm.items
      });
      setDonationForm({ name: '', phone: '', items: '' });
      alert("Thank you! Your donation pledge has been added.");
    }
  };

  const getTypeIcon = () => {
    if (request.userType === 'student') return <GraduationCap className="w-6 h-6 text-cyan-600" />;
    if (request.userType === 'school') return <School className="w-6 h-6 text-purple-600" />;
    return <Book className="w-6 h-6 text-amber-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${request.userType === 'student' ? 'bg-cyan-100' : request.userType === 'school' ? 'bg-purple-100' : 'bg-amber-100'}`}>
                {getTypeIcon()}
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{request.studentName}</h2>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" /> {request.location}, {request.district}
                </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-auto">
            
            <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto">
                
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Verification & Evidence</h3>
                    {request.userType === 'student' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                             {request.disasterImages && request.disasterImages.length > 0 ? (
                                 request.disasterImages.map((img, idx) => (
                                     <img key={idx} src={img} alt="Evidence" className="rounded-lg h-32 w-full object-cover border border-gray-200" />
                                 ))
                             ) : (
                                 <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400 text-xs">No images provided</div>
                             )}
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center text-blue-800">
                            <div className="bg-white p-2 rounded-full mr-3 border border-blue-100">
                                <School className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Official Request Letter Verified</p>
                                <p className="text-xs text-blue-600 opacity-80">Reference: {request.verificationDoc || 'Pending'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">The Story</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic border border-gray-100">"{request.story}"</p>
                </div>

                <div className="bg-cyan-50 rounded-xl p-5 border border-cyan-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Gift className="w-5 h-5 text-cyan-600" />
                        <h3 className="font-bold text-cyan-900">Pledge a Donation</h3>
                    </div>
                    
                    <form onSubmit={handleDonate} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={donationForm.name}
                                onChange={e => setDonationForm({...donationForm, name: e.target.value})}
                                required
                            />
                            <input 
                                type="tel" 
                                placeholder="Your Contact (Mobile)" 
                                className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={donationForm.phone}
                                onChange={e => setDonationForm({...donationForm, phone: e.target.value})}
                                required
                            />
                        </div>
                        <textarea 
                            placeholder="What would you like to donate? (e.g., 5 Books, Money)" 
                            className="w-full px-3 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                            rows="2"
                            value={donationForm.items}
                            onChange={e => setDonationForm({...donationForm, items: e.target.value})}
                            required
                        ></textarea>
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center">
                            <Send className="w-4 h-4 mr-2" /> Submit Pledge
                        </button>
                    </form>
                    
                    <div className="mt-4 pt-4 border-t border-cyan-200 flex items-center justify-between text-sm text-cyan-800">
                        <span className="font-semibold">Recipient Contact:</span>
                        <div className="flex items-center bg-white px-3 py-1 rounded-full border border-cyan-200">
                            <Phone className="w-3 h-3 mr-2" /> {request.phone}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 bg-gray-50 p-6 overflow-y-auto">
                <h3 className="text-gray-900 font-bold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" /> 
                    Community Support
                    <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {request.donations.length}
                    </span>
                </h3>

                <div className="space-y-3">
                    {request.donations.length > 0 ? (
                        request.donations.map((donation, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-gray-800 text-sm">{donation.donor}</span>
                                    <span className="text-[10px] text-gray-400">Just now</span>
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                    <span className="font-semibold text-cyan-600">Pledged:</span> {donation.items}
                                </div>
                                <div className="mt-2 flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    <Phone className="w-3 h-3 mr-1" /> {donation.contact}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <Gift className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">No donations yet.<br/>Be the first to help!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;