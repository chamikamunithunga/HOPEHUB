import React from 'react';
import { FileText, Heart, Activity } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

const StatsOverview = () => {
  const { requests } = useHopeHub();

  const totalRequests = requests.length;
  const totalDonations = requests.reduce((total, req) => total + req.donations.length, 0);
  const activeRequests = requests.filter(r => r.status === 'open').length;

  const StatCard = ({ icon: Icon, labelEn, labelSi, value, theme }) => {
    return (
      <div className={`stat-card ${theme}`}>
        <div className="bg-circle" />

        <div className="content">
          <div className="labels">
            <p className="label-en">
                {labelEn}
            </p>
            <p className="label-si">
                {labelSi}
            </p>
          </div>
          <h2 className="card-text">
            {value}
          </h2>
        </div>
        
        <div className="icon-box">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    );
  };

  return (
    <div className="stats-section">
      <div className="container">
        
        <div className="stats-header">
            <h1 className="stats-title">
               මේ ඔබේ උදව් අවශ්‍යම කාලයයි
            </h1>
        </div>

        <div className="grid-3">
          <StatCard 
            icon={FileText} 
            labelEn="Total Requests"
            labelSi="මුළු ඉල්ලීම්"
            value={totalRequests} 
            theme="blue"
          />
          <StatCard 
            icon={Heart} 
            labelEn="Donations Pledged"
            labelSi="පොරොන්දු වූ ආධාර"
            value={totalDonations} 
            theme="rose"
          />
          <StatCard 
            icon={Activity} 
            labelEn="Active Needs"
            labelSi="සක්‍රීය අවශ්‍යතා" 
            value={activeRequests} 
            theme="emerald"
          />
        </div>

      </div>
    </div>
  );
};

export default StatsOverview;