import React, { useState } from 'react';
import { Sparkles, Menu, X, ShieldAlert, HeartPulse } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, isAdminLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'checker', label: 'Symptom Checker' },
    { id: 'specialists', label: 'Find Specialists' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'booking', label: 'Book Appointment' },
    { id: 'therapy', label: 'Therapy Guide' },
    { id: 'community', label: 'Community Board' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2 cursor-pointer group text-left"
              id="navbar-logo-btn"
            >
              <div className="bg-purple-600 text-white p-2 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 shadow-sm">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1">
                  MedExpert <span className="text-purple-600 font-medium text-xs bg-purple-50 px-1.5 py-0.5 rounded-md">System</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block -mt-1 font-semibold">Clinical Expert Search Core</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  currentTab === link.id
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}

            {/* Admin link */}
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'border-purple-200 text-purple-700 bg-purple-50'
                  : 'border-slate-200 text-slate-500 hover:text-purple-700 hover:bg-slate-50'
              }`}
              id="nav-link-admin"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</span>
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={onLogout}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-100"
                id="nav-link-logout"
              >
                Logout
              </button>
            )}

            <button
              onClick={() => setCurrentTab('checker')}
              className="ml-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-4 rounded-full shadow-md hover:shadow-purple-100 transition-all flex items-center gap-1.5"
              id="nav-btn-checker-cta"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
              Check Symptoms
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-purple-600 p-2 rounded-lg focus:outline-none"
              id="navbar-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slideIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentTab === link.id
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
                id={`mobile-nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentTab('admin');
                setIsOpen(false);
              }}
              className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border ${
                currentTab === 'admin'
                  ? 'border-purple-200 text-purple-700 bg-purple-50'
                  : 'border-slate-200 text-slate-500 hover:text-purple-700 hover:bg-slate-50'
              }`}
              id="mobile-nav-link-admin"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Access'}</span>
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                id="mobile-nav-link-logout"
              >
                Logout Account
              </button>
            )}

            <div className="pt-2 px-2">
              <button
                onClick={() => {
                  setCurrentTab('checker');
                  setIsOpen(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-center py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                id="mobile-nav-btn-checker"
              >
                <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                Check Symptoms
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
