import React, { useState } from 'react';
import { X, MapPin, Phone, GraduationCap, School, Book, Send, User, Gift, Package, CheckCircle } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

const DonationModal = ({ request, onClose }) => {
  const { addDonation, requests } = useHopeHub(); 
  const [donationForm, setDonationForm] = useState({ name: '', phone: '', location: '', items: '' });

  if (!request) return null;

  const activeRequest = requests.find(r => r.id === request.id) || request;

  const handleDonate = (e) => {
    e.preventDefault();
    if (donationForm.name && donationForm.items && donationForm.location) {
      addDonation(activeRequest.id, {
        donor: donationForm.name,
        contact: donationForm.phone,
        location: donationForm.location, 
        items: donationForm.items
      });
      setDonationForm({ name: '', phone: '', location: '', items: '' });
    }
  };

  const getTypeIcon = () => {
    if (activeRequest.userType === 'student') return <GraduationCap className="w-6 h-6 text-cyan-600" />;
    if (activeRequest.userType === 'school') return <School className="w-6 h-6 text-purple-600" />;
    return <Book className="w-6 h-6 text-amber-600" />;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header">
          <div className="modal-title-box">
            <div className={`modal-icon-box ${activeRequest.userType}`}>
                {getTypeIcon()}
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{activeRequest.studentName}</h2>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" /> {activeRequest.location}, {activeRequest.district}
                </div>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-body">
            
            <div className="modal-content-main">
                
                <div className="detail-section">
                    <h3 className="section-title">
                        <Package className="w-4 h-4 mr-2" /> Needs Support For
                    </h3>
                    <div className="needs-grid">
                        {activeRequest.items.map((item, idx) => (
                            <span key={idx} className="need-tag">
                                <span className="dot"></span>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="section-title">Verification & Evidence</h3>
                    {activeRequest.userType === 'student' ? (
                        <div className="evidence-grid">
                             {activeRequest.disasterImages && activeRequest.disasterImages.length > 0 ? (
                                 activeRequest.disasterImages.map((img, idx) => (
                                     <img key={idx} src={img} alt="Evidence" className="evidence-img" />
                                 ))
                             ) : (
                                 <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400 text-xs col-span-2">No images provided</div>
                             )}
                        </div>
                    ) : (
                        <div className="verified-box">
                            <div className="verified-icon">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Official Request Letter Verified</p>
                                <p className="text-xs text-blue-600 opacity-80">Reference: {activeRequest.verificationDoc || 'Pending'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="detail-section">
                    <h3 className="section-title">The Story</h3>
                    <p className="story-box">"{activeRequest.story}"</p>
                </div>

                <div className="pledge-box">
                    <div className="flex items-center gap-2 mb-4">
                        <Gift className="w-5 h-5 text-cyan-600" />
                        <h3 className="font-bold text-cyan-900">Pledge a Donation</h3>
                    </div>
                    
                    <form onSubmit={handleDonate} className="pledge-form">
                        <div className="pledge-row">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="pledge-input"
                                value={donationForm.name}
                                onChange={e => setDonationForm({...donationForm, name: e.target.value})}
                                required
                            />
                            <input 
                                type="tel" 
                                placeholder="Your Contact (Mobile)" 
                                className="pledge-input"
                                value={donationForm.phone}
                                onChange={e => setDonationForm({...donationForm, phone: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                             <input 
                                type="text" 
                                placeholder="Your City / Location (e.g. Colombo)" 
                                className="pledge-input"
                                value={donationForm.location}
                                onChange={e => setDonationForm({...donationForm, location: e.target.value})}
                                required
                            />
                        </div>

                        <textarea 
                            placeholder="What would you like to donate? (e.g., 5 Books, Money)" 
                            className="pledge-input"
                            rows="2"
                            value={donationForm.items}
                            onChange={e => setDonationForm({...donationForm, items: e.target.value})}
                            required
                        ></textarea>
                        <button type="submit" className="pledge-btn">
                            <Send className="w-4 h-4 mr-2" /> Submit Pledge
                        </button>
                    </form>
                    
                    <div className="mt-4 pt-4 border-t border-cyan-200 flex items-center justify-between text-sm text-cyan-800">
                        <span className="font-semibold">Recipient Contact:</span>
                        <div className="flex items-center bg-white px-3 py-1 rounded-full border border-cyan-200">
                            <Phone className="w-3 h-3 mr-2" /> {activeRequest.phone}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-sidebar">
                <h3 className="text-gray-900 font-bold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" /> 
                    Community Support
                    <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                        {activeRequest.donations.length}
                    </span>
                </h3>

                <div className="donations-list">
                    {activeRequest.donations.length > 0 ? (
                        activeRequest.donations.slice().reverse().map((donation, idx) => (
                            <div key={idx} className="donation-card">
                                <div className="donor-info">
                                    <div>
                                        <div className="donor-name">{donation.donor}</div>
                                        <div className="donor-loc">
                                            <MapPin className="w-2.5 h-2.5 mr-1" /> {donation.location}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-300">Just now</span>
                                </div>
                                <div className="donation-details">
                                    <span className="pledged-label">Pledged:</span> {donation.items}
                                </div>
                                <div className="mt-2 flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
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