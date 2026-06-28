import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SymptomChecker from './components/SymptomChecker';
import SpecialistDirectory from './components/SpecialistDirectory';
import HospitalSearch from './components/HospitalSearch';
import Booking from './components/Booking';
import TherapyGuidePage from './components/TherapyGuide';
import About from './components/About';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import ChatBox from './components/ChatBox';
import CommunityBoard from './components/CommunityBoard';
import { ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [selectedSpecialistForHospitals, setSelectedSpecialistForHospitals] = useState<string>('');
  const [preselectedSpecialistId, setPreselectedSpecialistId] = useState<string>('');
  const [preselectedHospitalId, setPreselectedHospitalId] = useState<string>('');

  // Sync token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('purple_admin_token');
    if (token === 'purple-vision-secure-admin-token-2026') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('purple_admin_token');
    setIsAdminLoggedIn(false);
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-[#FCFBFD] text-slate-800 font-sans antialiased flex flex-col selection:bg-purple-200 relative overflow-x-hidden">
        
        {/* GLOBAL NAVBAR */}
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          isAdminLoggedIn={isAdminLoggedIn} 
          onLogout={handleLogout} 
        />

        {/* CORE VIEWPORT MAIN COMPONENT */}
        <main className="flex-1 flex flex-col">
          {currentTab === 'home' && <Home setCurrentTab={setCurrentTab} />}
          {currentTab === 'checker' && (
            <SymptomChecker 
              setCurrentTab={setCurrentTab} 
              setSelectedSpecialistForHospitals={setSelectedSpecialistForHospitals} 
              setPreselectedSpecialistId={setPreselectedSpecialistId}
            />
          )}
          {currentTab === 'specialists' && (
            <SpecialistDirectory 
              setCurrentTab={setCurrentTab} 
              setSelectedSpecialistForHospitals={setSelectedSpecialistForHospitals} 
              setPreselectedSpecialistId={setPreselectedSpecialistId}
            />
          )}
          {currentTab === 'hospitals' && (
            <HospitalSearch 
              preselectedSpecialistId={selectedSpecialistForHospitals} 
              setPreselectedSpecialistId={setSelectedSpecialistForHospitals} 
              setPreselectedHospitalId={setPreselectedHospitalId}
              setCurrentTab={setCurrentTab}
            />
          )}
          {currentTab === 'booking' && (
            <Booking 
              preselectedSpecialistId={preselectedSpecialistId}
              setPreselectedSpecialistId={setPreselectedSpecialistId}
              preselectedHospitalId={preselectedHospitalId}
              setPreselectedHospitalId={setPreselectedHospitalId}
              setCurrentTab={setCurrentTab}
            />
          )}
          {currentTab === 'therapy' && <TherapyGuidePage />}
          {currentTab === 'community' && <CommunityBoard />}
          {currentTab === 'about' && <About />}
          {currentTab === 'contact' && <Contact />}
          {currentTab === 'admin' && (
            <AdminDashboard 
              isAdminLoggedIn={isAdminLoggedIn} 
              setIsAdminLoggedIn={setIsAdminLoggedIn} 
            />
          )}
        </main>

        {/* MINI PERSISTENT SUB-FOOTER FOR INTERNAL PAGES */}
        {currentTab !== 'home' && (
          <footer className="bg-slate-900 text-slate-500 py-6 border-t border-slate-800 text-center text-xs mt-auto">
            <div className="px-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <HeartPulse className="w-4 h-4 text-purple-500 shrink-0" />
                <span>MedExpert System</span>
              </div>
              <span className="text-[10px] text-slate-400">Academic Rule-Based Study Model &bull; Active</span>
            </div>
          </footer>
        )}

        {/* FLOATING SUPPORT CHAT BOX */}
        <ChatBox />

      </div>
  );
}
