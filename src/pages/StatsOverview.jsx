import React from 'react';
import { FileText, Heart, Activity } from 'lucide-react';
import { useHopeHub } from '../contexts/HopeHubContext';

const StatsOverview = () => {
  const { requests } = useHopeHub();

  const totalRequests = requests.length;
  const totalDonations = requests.reduce((total, req) => total + req.donations.length, 0);
  const activeRequests = requests.filter(r => r.status === 'open').length;

  const StatCard = ({ icon: Icon, labelEn, labelSi, value, theme }) => {
    const themes = {
      blue: {
        wrapper: "bg-blue-50 border-blue-100",
        iconBg: "bg-white",
        iconColor: "text-blue-600",
        text: "text-blue-900",
        subtext: "text-blue-600"
      },
      rose: {
        wrapper: "bg-rose-50 border-rose-100",
        iconBg: "bg-white",
        iconColor: "text-rose-500",
        text: "text-rose-900",
        subtext: "text-rose-600"
      },
      emerald: {
        wrapper: "bg-emerald-50 border-emerald-100",
        iconBg: "bg-white",
        iconColor: "text-emerald-600",
        text: "text-emerald-900",
        subtext: "text-emerald-600"
      }
    };

    const currentTheme = themes[theme] || themes.blue;

    return (
      <div className={`${currentTheme.wrapper} p-6 rounded-2xl border flex items-center justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden`}>
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${currentTheme.iconColor} bg-current`} />

        <div className="relative z-10">
          <div className="mb-2">
            <p className={`${currentTheme.subtext} text-xs font-bold uppercase tracking-wider`}>
                {labelEn}
            </p>
            <p className={`${currentTheme.subtext} text-[10px] font-medium opacity-75`}>
                {labelSi}
            </p>
          </div>
          <h2 className={`text-4xl font-extrabold ${currentTheme.text}`}>
            {value}
          </h2>
        </div>
        
        <div className={`relative z-10 p-4 rounded-xl shadow-sm ${currentTheme.iconBg}`}>
          <Icon className={`w-8 h-8 ${currentTheme.iconColor}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12 text-center max-w-3xl mx-auto">
            
            <h1 className="text-gray-900 font-bold text-3xl md:text-4xl mb-2 font-serif leading-tight">
               "මේ ඔබේ අවශ්‍යම කාලයයි"
            </h1>
            
            <p className="text-gray-500 font-medium text-lg">
                This is the time you are needed most
            </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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