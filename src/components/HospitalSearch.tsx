import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Navigation, 
  ArrowRight, 
  Activity, 
  Filter,
  Check,
  Stethoscope,
  Map,
  X,
  Plus
} from 'lucide-react';
import { Hospital, Specialist } from '../types';

interface HospitalSearchProps {
  preselectedSpecialistId: string;
  setPreselectedSpecialistId: (id: string) => void;
  setPreselectedHospitalId: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function HospitalSearch({ 
  preselectedSpecialistId, 
  setPreselectedSpecialistId,
  setPreselectedHospitalId,
  setCurrentTab
}: HospitalSearchProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced filters
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterSpecialistId, setFilterSpecialistId] = useState(preselectedSpecialistId);
  const [activeHospitalPin, setActiveHospitalPin] = useState<Hospital | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state forwarding from preselected specialist
  useEffect(() => {
    setFilterSpecialistId(preselectedSpecialistId);
  }, [preselectedSpecialistId]);

  // Fetch Hospitals and Specialists on mount
  useEffect(() => {
    // Fetch specialists
    fetch('/api/specialists')
      .then(res => res.json())
      .then(data => setSpecialists(data))
      .catch(err => console.error("Failed to load specialists:", err));

    // Fetch initial hospitals
    fetchHospitals();
  }, [filterState, filterCity, filterSpecialistId]);

  const fetchHospitals = () => {
    let url = `/api/hospitals?`;
    if (filterState) url += `state=${encodeURIComponent(filterState)}&`;
    if (filterSpecialistId) url += `specialist=${encodeURIComponent(filterSpecialistId)}&`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load hospitals");
        return res.json();
      })
      .then(data => {
        let list = data;
        // Client side city filter for flexibility
        if (filterCity.trim() !== '') {
          list = list.filter((h: Hospital) => h.city.toLowerCase().includes(filterCity.toLowerCase()));
        }
        setHospitals(list);
        if (list.length > 0) {
          setActiveHospitalPin(list[0]);
        } else {
          setActiveHospitalPin(null);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Failed to query hospital networks.");
      });
  };

  // Extract unique states for dropdown filters
  const availableStates = ['Lagos', 'Oyo', 'FCT Abuja'];

  // Handle Search input
  const filteredHospitals = searchQuery.trim() === '' 
    ? hospitals 
    : hospitals.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Reset Filters
  const handleClearFilters = () => {
    setFilterState('');
    setFilterCity('');
    setFilterSpecialistId('');
    setPreselectedSpecialistId('');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-purple-600" />
          <span>Equipped Hospital Locator</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Locate registered hospital networks, check their available specialties and active physician clinics, and get turn-by-turn routing coordinates.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs">
          {errorMessage}
        </div>
      )}

      {/* FILTER & CONTROL BAR */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-800 pb-2.5 border-b border-slate-100">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="font-bold text-sm tracking-tight">Filter Hospital Network</span>
          { (filterState || filterCity || filterSpecialistId || searchQuery) && (
            <button 
              onClick={handleClearFilters}
              className="ml-auto text-xs font-bold text-purple-600 hover:text-purple-800"
              id="btn-clear-hospital-filters"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* State select filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select State</label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white text-xs font-semibold rounded-xl px-3.5 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600"
              id="filter-select-state"
            >
              <option value="">All States (Nigeria)</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* City text search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type City / Area</label>
            <input 
              type="text"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              placeholder="e.g. Ikoyi, Ikeja..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white text-xs font-semibold rounded-xl px-3.5 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600"
              id="filter-input-city"
            />
          </div>

          {/* Specialist select filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Specialty</label>
            <select
              value={filterSpecialistId}
              onChange={(e) => {
                setFilterSpecialistId(e.target.value);
                setPreselectedSpecialistId(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white text-xs font-semibold rounded-xl px-3.5 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600"
              id="filter-select-specialist"
            >
              <option value="">Any Specialist</option>
              {specialists.map(spec => (
                <option key={spec.id} value={spec.id}>{spec.title}</option>
              ))}
            </select>
          </div>

          {/* Direct Search keyword input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Name</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hospital name..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                id="hospital-keyword-input"
              />
            </div>
          </div>

        </div>
      </div>

      {/* CORE SPLIT WORKSPACE: MAP & RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Vector Map Locator (5/12 width) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
              <Map className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-sm text-slate-900 tracking-tight">Interactive Localizer Grid</span>
              <span className="text-[10px] bg-emerald-50 border border-emerald-150 text-emerald-700 font-bold px-2 py-0.5 rounded ml-auto">
                {filteredHospitals.length} pins active
              </span>
            </div>

            {/* Simulated Vector Grid Map */}
            <div className="aspect-square bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center select-none" id="hospital-vector-grid-map">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              
              {/* Compass symbol */}
              <div className="absolute bottom-3 right-3 bg-white/85 border border-slate-200 p-2 rounded-xl text-[10px] font-mono text-slate-400 font-bold flex flex-col items-center">
                <span>N</span>
                <span className="text-purple-600">&uarr;</span>
              </div>

              {filteredHospitals.length === 0 ? (
                <div className="text-center p-6 text-slate-400 text-xs font-semibold space-y-1 relative z-10">
                  <X className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No map points matching filter criteria.</p>
                </div>
              ) : (
                <>
                  {/* Generate pseudo markers for active hospitals */}
                  {filteredHospitals.map((hosp, idx) => {
                    // Seeded random coordinate generator for consistent positioning based on id hash code
                    let codeSum = 0;
                    for (let i = 0; i < hosp.name.length; i++) codeSum += hosp.name.charCodeAt(i);
                    const posX = 15 + (codeSum % 70); // 15% to 85% range
                    const posY = 15 + ((codeSum * 7) % 70);

                    const isActive = activeHospitalPin?.id === hosp.id;

                    return (
                      <button
                        key={hosp.id}
                        onClick={() => setActiveHospitalPin(hosp)}
                        style={{ left: `${posX}%`, top: `${posY}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-115 active:scale-95 z-20"
                        title={`Click to view ${hosp.name}`}
                        id={`map-pin-${hosp.id}`}
                      >
                        <div className="relative">
                          {/* Pulsing ring under active marker */}
                          {isActive && (
                            <span className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-45 -m-2" />
                          )}
                          
                          {/* Marker Icon */}
                          <div className={`p-2 rounded-full shadow-md border transition-all ${
                            isActive 
                              ? 'bg-purple-600 text-white border-purple-700 scale-110' 
                              : 'bg-white text-purple-600 border-slate-200'
                          }`}>
                            <MapPin className="w-4 h-4 shrink-0" />
                          </div>

                          {/* Hover tooltip label */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-40">
                            {hosp.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Display active pinpoint details card */}
            {activeHospitalPin ? (
              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl space-y-2 animate-slideIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-purple-700 tracking-wider font-mono">Pinpoint Selection</span>
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{activeHospitalPin.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{activeHospitalPin.state}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-tight">{activeHospitalPin.address}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-purple-700">
                  <a href={`tel:${activeHospitalPin.phone}`} className="flex items-center gap-1 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeHospitalPin.phone}</span>
                  </a>
                  <a 
                    href={activeHospitalPin.googleMapsLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-slate-600 bg-white border border-slate-200 py-1 px-2.5 rounded-lg"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-200 text-center text-slate-400 text-xs rounded-xl">
                Select any locator pin to view direct details.
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Hospital Cards Grid (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Available Clinics ({filteredHospitals.length})</h3>
            {filterSpecialistId && (
              <span className="text-[11px] text-purple-600 font-bold bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                Filtered: Mapped Specialist Active
              </span>
            )}
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="bg-white border border-slate-150 p-12 rounded-3xl text-center space-y-4">
              <MapPin className="w-12 h-12 text-slate-200 mx-auto" />
              <h4 className="font-extrabold text-slate-900 text-base">No Matching Hospital Networks</h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed font-semibold">
                There are no registered facilities matching your selected State or Specialist filters inside our lookup indexes.
              </p>
              <button 
                onClick={handleClearFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all"
              >
                Reset Filters & Search All
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="hospital-results-list">
              {filteredHospitals.map((hosp) => {
                const isActiveOnMap = activeHospitalPin?.id === hosp.id;
                
                return (
                  <div 
                    key={hosp.id}
                    onClick={() => setActiveHospitalPin(hosp)}
                    className={`bg-white border p-5 sm:p-6 rounded-2xl shadow-3xs cursor-pointer transition-all flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden ${
                      isActiveOnMap 
                        ? 'border-purple-300 ring-2 ring-purple-100 bg-[#FCFAFE]/40' 
                        : 'border-slate-150 hover:border-slate-300'
                    }`}
                    id={`hospital-card-${hosp.id}`}
                  >
                    {/* Left details */}
                    <div className="space-y-3.5 flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-purple-50 border border-purple-100 text-purple-700 font-bold text-[9px] px-2 py-0.5 rounded-md">
                            {hosp.state} &bull; {hosp.city}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{hosp.name}</h4>
                      </div>

                      <div className="text-xs text-slate-500 font-medium flex items-start gap-1.5 leading-normal">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{hosp.address}</span>
                      </div>

                      {/* Phone contact line */}
                      <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <a href={`tel:${hosp.phone}`} className="hover:underline">{hosp.phone}</a>
                      </div>

                      {/* Specialist Departments indicator */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Specialist Departments Equipped:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {hosp.availableSpecialists.map((specId) => {
                            const specObj = specialists.find(s => s.id === specId);
                            if (!specObj) return null;
                            const isPreselectedMatch = specId === filterSpecialistId;

                            return (
                              <span 
                                key={specId} 
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                                  isPreselectedMatch 
                                    ? 'bg-purple-600 text-white border-purple-700 shadow-3xs' 
                                    : 'bg-slate-50 text-slate-500 border-slate-100'
                                }`}
                              >
                                {specObj.title}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Right action button */}
                    <div className="flex md:flex-col justify-between items-end gap-2.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreselectedHospitalId(hosp.id);
                          if (filterSpecialistId) {
                            setPreselectedSpecialistId(filterSpecialistId);
                          }
                          setCurrentTab('booking');
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 shadow-sm transition-all w-full md:w-auto justify-center"
                        id={`btn-book-hosp-${hosp.id}`}
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-200" />
                        <span>Book Consult</span>
                      </button>

                      <a 
                        href={hosp.googleMapsLink}
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all w-full md:w-auto justify-center"
                        id={`btn-hospital-maps-link-${hosp.id}`}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
