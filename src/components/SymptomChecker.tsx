import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  X, 
  Plus, 
  MapPin, 
  BriefcaseMedical,
  Stethoscope,
  HeartPulse,
  Flame,
  UserCheck
} from 'lucide-react';
import { Symptom, AnalysisResult } from '../types';

interface SymptomCheckerProps {
  setCurrentTab: (tab: string) => void;
  setSelectedSpecialistForHospitals: (specialistId: string) => void;
  setPreselectedSpecialistId: (specialistId: string) => void;
}

export default function SymptomChecker({ 
  setCurrentTab, 
  setSelectedSpecialistForHospitals,
  setPreselectedSpecialistId
}: SymptomCheckerProps) {
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all symptoms
  useEffect(() => {
    fetch('/api/symptoms')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load symptoms");
        return res.json();
      })
      .then((data) => setAllSymptoms(data))
      .catch((err) => {
        console.error(err);
        setErrorMessage("Unable to communicate with the medical expert rules server.");
      });
  }, []);

  // Handle Search autocomplete/filter
  const filteredSymptoms = searchQuery.trim() === '' 
    ? [] 
    : allSymptoms.filter(sym => sym.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Toggle selection
  const handleToggleSymptom = (id: string) => {
    if (selectedSymptomIds.includes(id)) {
      setSelectedSymptomIds(selectedSymptomIds.filter(item => item !== id));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, id]);
    }
  };

  // Clear all selections
  const handleReset = () => {
    setSelectedSymptomIds([]);
    setResults([]);
    setHasSearched(false);
    setSearchQuery('');
  };

  // Analyze Symptoms trigger
  const handleAnalyze = async () => {
    if (selectedSymptomIds.length === 0) {
      setErrorMessage("Please select at least one symptom to run the expert diagnostic rule mapping.");
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisProgress(5);

    // Beautiful loading animation tick
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 150);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptomIds: selectedSymptomIds })
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Expert engine could not complete the query matching.");
      }

      const data = await response.json();
      setTimeout(() => {
        setResults(data.results || []);
        setIsAnalyzing(false);
        setHasSearched(true);
      }, 350);

    } catch (err: any) {
      console.error(err);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setErrorMessage(err.message || "Rule-based analysis engine failed to complete. Please try again.");
    }
  };

  // Route to Hospitals with preselected filter
  const routeToHospitalsWithSpecialist = (specId: string) => {
    setSelectedSpecialistForHospitals(specId);
    setCurrentTab('hospitals');
  };

  // Group symptoms by category
  const categories: Record<string, Symptom[]> = {
    'Head & Neurological': [],
    'Chest & Respiratory': [],
    'Digestive': [],
    'Skin': [],
    'Eyes & Vision': [],
    'Musculoskeletal': [],
    'General': []
  };

  allSymptoms.forEach(sym => {
    if (categories[sym.category]) {
      categories[sym.category].push(sym);
    } else {
      categories['General'].push(sym);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <HeartPulse className="w-8 h-8 text-purple-600" />
          <span>MedExpert Symptom Checker</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Identify potential medical conditions and discover mapped specialist departments using our secure, clinical rule-based expert matching system.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-sm text-red-700" id="checker-error-alert">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <span className="font-bold">Error Processing Rules: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* RENDER PROGRESS OR LOADING ANIMATION */}
      {isAnalyzing ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg max-w-xl mx-auto my-12 space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
            <Activity className="w-10 h-10 text-purple-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-lg">Running Rule-Based Clinical Engine</h3>
            <p className="text-xs text-slate-400 font-mono">Comparing symptoms to standard disease parameters...</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-purple-600 h-full transition-all duration-150 ease-out rounded-full"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-purple-700 font-mono">{analysisProgress}% Processed</span>
        </div>
      ) : hasSearched ? (
        
        // ==================== STEP 3: DISPLAY RESULTS ====================
        <div className="space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-purple-50 border border-purple-100/50 p-4 rounded-2xl">
            <div className="text-left">
              <h3 className="text-sm font-bold text-purple-900">Analysis Completed</h3>
              <p className="text-xs text-purple-700 font-medium">Mapped {selectedSymptomIds.length} symptom selections against clinical lookup indexes.</p>
            </div>
            <button 
              onClick={handleReset}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
              id="checker-btn-reset-results"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Test Other Symptoms</span>
            </button>
          </div>

          {results.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-extrabold text-slate-900">No Definite Condition Mapped</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The current system rules do not map these symptoms to a specific disease with significant confidence. 
                We highly recommend checking with a general practitioner for tailored checks.
              </p>
              <button
                onClick={() => routeToHospitalsWithSpecialist('spec_gp')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-5 rounded-xl inline-flex items-center gap-1.5"
              >
                <span>Find General Practitioners</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Possible Conditions List (7/12 width) */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Possible Mapped Conditions ({results.length})</h3>
                
                {results.map((result, idx) => (
                  <div 
                    key={result.disease.id}
                    className={`bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all ${
                      idx === 0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200'
                    }`}
                    id={`analysis-result-card-${result.disease.id}`}
                  >
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white font-bold text-[10px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
                        Highest Overlap Match
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name & Confidence */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-lg font-extrabold text-slate-900">{result.disease.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            result.matchScore > 75 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {result.matchScore}% Match Score
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.disease.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5 border-t border-slate-100">
                        {/* Mapped Specialist info */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Specialist</span>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                              <Stethoscope className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{result.specialist.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{result.specialist.description}</p>
                        </div>

                        {/* Urgency Level */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgency Level</span>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${
                              result.urgencyLevel === 'High' 
                                ? 'bg-rose-500 animate-ping' 
                                : result.urgencyLevel === 'Medium' 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                            }`} />
                            <span className={`font-extrabold text-xs sm:text-sm ${
                              result.urgencyLevel === 'High' 
                                ? 'text-rose-600' 
                                : result.urgencyLevel === 'Medium' 
                                  ? 'text-amber-600' 
                                  : 'text-emerald-600'
                            }`}>
                              {result.urgencyLevel === 'High' 
                                ? '🚨 Urgent Consultation Required' 
                                : result.urgencyLevel === 'Medium' 
                                  ? '🟡 Consult a Doctor within 48 Hours' 
                                  : '🟢 Routine consultation'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action trigger */}
                      <div className="pt-4 flex justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setPreselectedSpecialistId(result.specialist.id);
                            setCurrentTab('booking');
                          }}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs py-2 px-4 rounded-xl inline-flex items-center gap-1 transition-all"
                          id={`btn-book-spec-result-${result.specialist.id}`}
                        >
                          <span>Book Consult</span>
                        </button>
                        
                        <button
                          onClick={() => routeToHospitalsWithSpecialist(result.specialist.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm hover:shadow-purple-100 transition-all"
                        >
                          <span>Find Equipped Hospitals</span>
                          <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}

              </div>

              {/* Right Column: First-Step Therapy Advice (5/12 width) */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">First-Step Self Care</h3>

                {results[0]?.therapyAdvice ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
                      <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">Therapy Guidance Advice</h4>
                        <p className="text-[10px] text-slate-400 font-mono block">Fallback Relief Measures Only</p>
                      </div>
                    </div>

                    {/* Advice bullet points */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initial Self Care Actions:</span>
                      <ul className="space-y-2.5">
                        {results[0].therapyAdvice.basicAdvice.map((bullet, index) => (
                          <li key={index} className="text-xs text-slate-600 flex items-start gap-2.5 font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Red flag indicators */}
                    <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>See Doctor If:</span>
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {results[0].therapyAdvice.seeDocIf}
                      </p>
                    </div>

                    {/* Emergency signals */}
                    {results[0].therapyAdvice.emergencyFlags && (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-600" />
                          <span>Emergency Warning Signs</span>
                        </span>
                        <p className="text-xs text-rose-700 font-bold leading-relaxed">
                          {results[0].therapyAdvice.emergencyFlags}
                        </p>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-slate-400 text-xs py-10 space-y-2">
                    <Activity className="w-10 h-10 text-slate-200 mx-auto" />
                    <p>No localized self-care guidelines pre-mapped for the highest matched condition.</p>
                  </div>
                )}

                {/* Global Results Disclaimer */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs text-slate-500 leading-normal font-medium">
                  <strong>Global Safety Notice:</strong> MedExpert is a guidance tool only. It uses a rule-based system to suggest possible conditions and specialists. It does not provide medical diagnoses, prescribe medications, or replace the advice of a licensed medical professional. Always consult a qualified healthcare provider for proper diagnosis and treatment.
                </div>

              </div>

            </div>
          )}

        </div>

      ) : (

        // ==================== STEP 1: CHOOSE SYMPTOMS ====================
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick instructions & Smart search */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-150 p-6 sm:p-8 rounded-3xl shadow-xs">
            <div className="lg:col-span-5 space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">Enter Active Symptoms</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                Use the search block to quickly filter, or click direct categorical checkboxes below to build your symptom analysis profile.
              </p>
            </div>

            {/* Live Autocomplete search block */}
            <div className="lg:col-span-7 relative">
              <div className="flex items-center bg-slate-50 border border-slate-250 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-600 focus-within:bg-white transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search symptom e.g. headache, chest pain..."
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  id="checker-search-input"
                />
                {searchQuery.trim() !== '' && (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200 rounded-full">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-30 max-h-56 overflow-y-auto p-2 space-y-1">
                  {filteredSymptoms.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs font-semibold">No matching symptom found</div>
                  ) : (
                    filteredSymptoms.map(sym => {
                      const isSelected = selectedSymptomIds.includes(sym.id);
                      return (
                        <button
                          key={sym.id}
                          onClick={() => {
                            handleToggleSymptom(sym.id);
                            setSearchQuery('');
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs flex justify-between items-center transition-all ${
                            isSelected 
                              ? 'bg-purple-50 text-purple-700 font-bold' 
                              : 'text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>{sym.name} ({sym.category})</span>
                          {isSelected ? (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black">Added</span>
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected symptom pills indicators */}
          {selectedSymptomIds.length > 0 && (
            <div className="bg-purple-50/50 border border-purple-100/60 p-4 rounded-2xl space-y-2.5 animate-slideIn">
              <div className="flex justify-between items-center text-xs font-bold text-purple-900">
                <span>Selected Symptoms ({selectedSymptomIds.length})</span>
                <button onClick={handleReset} className="text-purple-600 hover:text-purple-800">Clear All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSymptomIds.map(id => {
                  const symObj = allSymptoms.find(s => s.id === id);
                  if (!symObj) return null;
                  return (
                    <div 
                      key={id}
                      className="bg-purple-600 text-white font-semibold text-[11px] pl-3 pr-2 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-purple-700/30"
                    >
                      <span>{symObj.name}</span>
                      <button 
                        onClick={() => handleToggleSymptom(id)}
                        className="bg-purple-800 hover:bg-purple-900 p-0.5 rounded-full"
                        id={`remove-sym-pill-${id}`}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categorized checkbox matrix */}
          <div className="space-y-8">
            {Object.keys(categories).map(catName => {
              const syms = categories[catName];
              if (syms.length === 0) return null;

              return (
                <div key={catName} className="bg-white border border-slate-150 p-5 sm:p-6 rounded-3xl shadow-2xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                    <Activity className="w-3.5 h-3.5 text-purple-600" />
                    <span>{catName} Symptoms</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {syms.map(sym => {
                      const isSelected = selectedSymptomIds.includes(sym.id);
                      return (
                        <div 
                          key={sym.id}
                          onClick={() => handleToggleSymptom(sym.id)}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'bg-purple-50/70 border-purple-400 text-purple-900 font-extrabold shadow-3xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                          }`}
                          id={`checkbox-symptom-${sym.id}`}
                        >
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // toggled by parent click
                            className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 shrink-0 pointer-events-none"
                          />
                          <span className="text-xs leading-normal">{sym.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Analysis trigger */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-md sticky bottom-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 font-semibold block">Symptom Selection Status:</span>
              <span className="text-sm font-extrabold text-slate-800">
                {selectedSymptomIds.length === 0 
                  ? 'No symptoms chosen' 
                  : `${selectedSymptomIds.length} symptom(s) active`}
              </span>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={selectedSymptomIds.length === 0}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-black px-10 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              id="btn-analyze-symptoms"
            >
              <Activity className="w-4 h-4 text-purple-200" />
              <span>Analyze Symptoms</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
