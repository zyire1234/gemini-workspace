import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Stethoscope, 
  ArrowRight, 
  Activity, 
  MapPin, 
  CheckCircle, 
  BriefcaseMedical, 
  X,
  Sparkles
} from 'lucide-react';
import { Specialist } from '../types';

interface SpecialistDirectoryProps {
  setCurrentTab: (tab: string) => void;
  setSelectedSpecialistForHospitals: (specialistId: string) => void;
  setPreselectedSpecialistId: (specialistId: string) => void;
}

export default function SpecialistDirectory({ 
  setCurrentTab, 
  setSelectedSpecialistForHospitals,
  setPreselectedSpecialistId
}: SpecialistDirectoryProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all specialists
  useEffect(() => {
    fetch('/api/specialists')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load specialists directory");
        return res.json();
      })
      .then((data) => setAllSpecialistsData(data))
      .catch((err) => {
        console.error(err);
        setErrorMessage("Unable to fetch specialist details from the local rule service.");
      });
  }, []);

  const setAllSpecialistsData = (data: Specialist[]) => {
    setSpecialists(data);
  };

  // Filter lists
  const filteredSpecialists = specialists.filter(spec => 
    spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.conditionsTreated.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Link to hospital search with filter
  const handleFindHospitals = (specId: string) => {
    setSelectedSpecialistForHospitals(specId);
    setCurrentTab('hospitals');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Stethoscope className="w-8 h-8 text-purple-600" />
          <span>Medical Specialist Directory</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Understand different medical specialties, browse conditions they manage, and find the right expert hospital near you.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
          {errorMessage}
        </div>
      )}

      {/* DETAIL MODAL DRILL DOWN */}
      {selectedSpecialist && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-purple-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 text-white rounded-xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{selectedSpecialist.title}</h3>
                  <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">Specialty Details</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSpecialist(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                id="close-specialist-modal"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Role & Description</h4>
                <p className="text-slate-700 leading-relaxed font-medium">{selectedSpecialist.description}</p>
              </div>

              {/* Conditions Treated tags list */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Common Conditions Managed</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialist.conditionsTreated.map((cond, idx) => (
                    <div 
                      key={idx}
                      className="bg-purple-50 text-purple-700 border border-purple-100 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation details helper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-extrabold text-slate-800 text-xs block">When to Consult?</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    See this specialist if you suffer persistent symptoms mapping to their category, or are referred for further clinical evaluation.
                  </p>
                </div>
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-extrabold text-slate-800 text-xs block">What to Expect?</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Initial assessment involves thorough reviews of symptomatic history, general vital mappings, and diagnostic check plans.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Ready to book an appointment?</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedSpecialist(null)}
                  className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPreselectedSpecialistId(selectedSpecialist.id);
                    setCurrentTab('booking');
                    setSelectedSpecialist(null);
                  }}
                  className="flex-1 sm:flex-none bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
                  id="modal-book-consult-btn"
                >
                  Book Consult
                </button>
                <button
                  onClick={() => {
                    handleFindHospitals(selectedSpecialist.id);
                    setSelectedSpecialist(null);
                  }}
                  className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 shadow-md hover:shadow-purple-100 transition-all"
                  id="modal-find-hospital-btn"
                >
                  <span>Equipped Hospitals</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs max-w-xl mx-auto flex items-center bg-slate-50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-600 focus-within:bg-white transition-all">
        <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search specialty e.g. Cardiologist, Dermatologist..."
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
          id="specialist-search-input"
        />
        {searchQuery.trim() !== '' && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Clear</button>
        )}
      </div>

      {/* Grid List */}
      {filteredSpecialists.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-medium text-sm space-y-2">
          <Stethoscope className="w-12 h-12 text-slate-200 mx-auto" />
          <p>No specialists match your filter keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="specialist-grid">
          {filteredSpecialists.map((spec) => (
            <div 
              key={spec.id}
              className="bg-white border border-slate-150 p-5 sm:p-6 rounded-2xl shadow-3xs flex flex-col justify-between gap-5 hover:border-purple-300 hover:shadow-md transition-all group"
              id={`specialist-card-${spec.id}`}
            >
              <div className="space-y-3.5">
                {/* Header Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-purple-700 text-sm sm:text-base transition-colors">{spec.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-3">{spec.description}</p>

                {/* Condition tags checklist preview */}
                <div className="flex flex-wrap gap-1.5">
                  {spec.conditionsTreated.slice(0, 3).map((cond, idx) => (
                    <span 
                      key={idx} 
                      className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-100"
                    >
                      {cond}
                    </span>
                  ))}
                  {spec.conditionsTreated.length > 3 && (
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">
                      +{spec.conditionsTreated.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedSpecialist(spec)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  id={`btn-view-spec-details-${spec.id}`}
                >
                  View Full Details
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setPreselectedSpecialistId(spec.id);
                      setCurrentTab('booking');
                    }}
                    className="text-xs font-bold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 hover:border-purple-200 px-2.5 py-1.5 rounded-lg transition-colors"
                    id={`btn-book-spec-${spec.id}`}
                  >
                    Book
                  </button>
                  <button 
                    onClick={() => handleFindHospitals(spec.id)}
                    className="text-xs font-black text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-all"
                    id={`btn-find-hosp-spec-${spec.id}`}
                  >
                    <span>Hospitals</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
