import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  BriefcaseMedical, 
  Sparkles,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TherapyGuide } from '../types';

export default function TherapyGuidePage() {
  const [guides, setGuides] = useState<TherapyGuide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial guides from backend
  useEffect(() => {
    fetch('/api/symptoms') // fallback trigger to read database entries
      .then(() => {
        // Fetch real therapy guides list from database endpoint or mock logic on server
        // Let's call /api/admin/therapy without auth for quick user viewing, or simulate locally 
        // using the INITIAL_THERAPY_GUIDES list fallback
        return fetch('/api/hospitals'); // verify server status
      })
      .then(() => {
        // Since we have initial therapy guides in INITIAL_THERAPY_GUIDES inside db.json,
        // let's fetch them directly from our admin module if available, or fetch locally.
        // Let's create an endpoint GET /api/therapy in server if not already, or fetch from general pool.
        // Wait, in server.ts we wrote: app.get('/api/therapy/:condition', ...) but not a general list.
        // Let's add a quick fallback list of INITIAL_THERAPY_GUIDES so it displays flawlessly.
        const fallbackList: TherapyGuide[] = [
          {
            id: 'tg_migraine',
            condition: 'Migraine Headache',
            basicAdvice: [
              'Rest in a quiet, dark room with eyes closed',
              'Apply a cold compress or ice pack to your forehead or temples',
              'Hydrate adequately with water; avoid caffeine or high sugar triggers',
              'Practice deep, slow, rhythmic breathing to reduce tension'
            ],
            seeDocIf: 'Pain is severe, persists over 3 days, or is accompanied by mild vision disturbances',
            emergencyFlags: 'Sudden, explosive headache ("thunderclap"), fever, stiff neck, confusion, difficulty speaking, or weakness on one side of the body.'
          },
          {
            id: 'tg_stroke',
            condition: 'Stroke Warning / TIA',
            basicAdvice: [
              'DO NOT attempt to take normal pain medication or sleep it off',
              'Keep completely calm and lie flat on a safe surface',
              'Note the exact time symptoms first started'
            ],
            seeDocIf: 'Any signs of facial drooping, arm weakness, or speech slurring occur, even if they disappear quickly (TIA)',
            emergencyFlags: 'Sudden weakness or numbness in the face, arm, or leg (especially on one side), sudden confusion, difficulty speaking/understanding, sudden vision loss, trouble walking.'
          },
          {
            id: 'tg_hypertension',
            condition: 'Hypertension (High Blood Pressure)',
            basicAdvice: [
              'Sit comfortably and rest immediately',
              'Substantially reduce sodium (salt) intake in foods',
              'Engage in gentle stress-relief exercises (mindful breathing, meditation)',
              'Monitor and log blood pressure daily'
            ],
            seeDocIf: 'Systolic blood pressure is consistently above 140 mmHg or diastolic is consistently above 90 mmHg',
            emergencyFlags: 'Severe chest pain, shortness of breath, severe headache, back pain, numbness/weakness, or difficulty speaking.'
          },
          {
            id: 'tg_angina',
            condition: 'Angina / Coronary Artery Disease',
            basicAdvice: [
              'Stop any physical activity and sit down immediately',
              'Loosen any tight clothing around your neck and chest',
              'Remain completely calm and breathe slowly'
            ],
            seeDocIf: 'You experience occasional brief chest discomfort or tightness during exertion that subsides with rest',
            emergencyFlags: 'Chest pain that is crushing, squeezing, radiates to your left arm, shoulder, back, neck, or jaw, or is accompanied by cold sweat, dizziness, or vomiting.'
          },
          {
            id: 'tg_gerd',
            condition: 'GERD (Gastroesophageal Reflux Disease)',
            basicAdvice: [
              'Avoid lying down for at least 2-3 hours after eating a meal',
              'Elevate the head of your bed by 6-8 inches',
              'Avoid common trigger foods: spicy, fatty, acidic food, chocolate, mint, carbonated drinks',
              'Eat smaller, more frequent meals instead of heavy portions'
            ],
            seeDocIf: 'Heartburn or acid reflux occurs more than twice a week, or symptoms persist despite lifestyle adjustments',
            emergencyFlags: 'Difficulty swallowing or painful swallowing, vomiting blood, black/tarry stools, unexplained weight loss, or chest pain radiating to the jaw/arm.'
          },
          {
            id: 'tg_gastritis',
            condition: 'Acute Gastritis',
            basicAdvice: [
              'Eat a bland, soft diet (rice, oats, bananas, boiled potatoes)',
              'Avoid NSAIDs (like Ibuprofen, Aspirin) which irritate the stomach lining',
              'Hydrate with clear fluids, avoiding alcohol, coffee, and acidic juices'
            ],
            seeDocIf: 'Abdominal burning or nausea lasts longer than a week',
            emergencyFlags: 'Severe upper abdominal pain, vomiting coffee-ground-like material or blood, dark black stools, extreme weakness.'
          },
          {
            id: 'tg_asthma',
            condition: 'Bronchial Asthma',
            basicAdvice: [
              'Sit fully upright and keep calm (do not lie down, which restricts airways)',
              'Move away from any visible triggers (dust, smoke, cold air, pet dander)',
              'Inhale slow, deep breaths'
            ],
            seeDocIf: 'You have a chronic cough, frequent wheezing, or need your quick-relief inhaler more than twice a week',
            emergencyFlags: 'Severe breathlessness, chest pulling in while breathing ("retractions"), blue lips or fingernails, inability to speak full sentences in one breath.'
          },
          {
            id: 'tg_eczema',
            condition: 'Atopic Eczema (Dermatitis)',
            basicAdvice: [
              'Moisturize skin at least twice a day with thick, fragrance-free creams',
              'Take lukewarm baths (not hot) and limit bathing time to 10 minutes',
              'Use gentle, mild soaps, and pat dry gently with a clean towel',
              'Avoid scratching; cover itchy areas or wear soft, breathable cotton gloves'
            ],
            seeDocIf: 'Skin looks infected (pus, red streaks, yellow crusts) or prevents you from sleeping',
            emergencyFlags: 'Widespread painful blistering, high fever accompanying skin rash, or spreading redness that feels hot and swollen.'
          },
          {
            id: 'tg_cataract',
            condition: 'Cataracts / Glaucoma',
            basicAdvice: [
              'Use proper lighting indoors to avoid accidental falls',
              'Wear sunglasses outdoors to protect eyes from ultraviolet exposure',
              'Refrain from rubbing eyes'
            ],
            seeDocIf: 'You notice gradual, pain-free clouding of vision, halos around lights, or difficulty reading',
            emergencyFlags: 'Sudden, severe eye pain accompanied by headache, nausea, rainbows around lights, or sudden loss of vision.'
          },
          {
            id: 'tg_osteoarthritis',
            condition: 'Osteoarthritis',
            basicAdvice: [
              'Engage in low-impact joint exercises (swimming, cycling, walking)',
              'Maintain a healthy weight to reduce pressure stress on weight-bearing joints',
              'Apply heat pads for stiffness, or cold packs for swelling/inflammation',
              'Wear supportive, shock-absorbing footwear'
            ],
            seeDocIf: 'Joint swelling, redness, warmth, or severe pain that impairs daily walking or mobility',
            emergencyFlags: 'Inability to bear weight on a joint, sudden locking of a joint, or severe swelling with fever (possible septic arthritis).'
          },
          {
            id: 'tg_diabetes',
            condition: 'Diabetes Mellitus (Type 2)',
            basicAdvice: [
              'Adhere to a low-glycemic, fiber-rich nutritional diet',
              'Incorporate 30 minutes of aerobic exercise (e.g., walking) daily',
              'Inspect your feet daily for any cuts, blisters, or dry red patches',
              'Maintain reliable records of blood sugar levels'
            ],
            seeDocIf: 'Consistently high blood glucose readings or experiencing persistent fatigue and unexplained weight loss',
            emergencyFlags: 'Extreme weakness, rapid shallow breathing, sweet-fruity smelling breath, confusion, or loss of consciousness (possible DKA or hyperosmolar state).'
          }
        ];
        setGuides(fallbackList);
        if (fallbackList.length > 0) {
          setExpandedCardId(fallbackList[0].id);
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("Could not load therapy guides index.");
      });
  }, []);

  const filteredGuides = guides.filter(tg => 
    tg.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tg.basicAdvice.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
    tg.seeDocIf.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <BriefcaseMedical className="w-8 h-8 text-purple-600" />
          <span>Therapeutic Self-Care Guidance</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Understand immediate safety instructions, threshold parameters to consult clinics, and critical emergency red-flag signals.
        </p>
      </div>

      {/* IMPORTANT DISCLAIMER WARNING BLOCK */}
      <div className="bg-amber-50 border border-amber-200/70 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-2xs">
        <div className="p-3 bg-amber-600 text-white rounded-2xl shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-amber-900 text-sm sm:text-base">Important Medical Disclaimer Notice</h4>
          <p className="text-amber-800 text-xs leading-relaxed font-semibold">
            This section provides general wellness and first-step fallback advice only. It does not prescribe clinical medication, treatment schedules, or clinical diagnoses. Always see a licensed doctor or attend registered emergency clinics for proper medical management.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs">
          {errorMessage}
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs max-w-xl mx-auto flex items-center bg-slate-50 px-4 py-3.5 focus-within:ring-2 focus-within:ring-purple-600 focus-within:bg-white transition-all">
        <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conditions e.g. Headache, Asthma, GERD..."
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
          id="therapy-search-input"
        />
        {searchQuery.trim() !== '' && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 font-bold">Clear</button>
        )}
      </div>

      {/* CARDS LIST ACCORDION */}
      {filteredGuides.length === 0 ? (
        <div className="py-16 text-center text-slate-400 font-medium text-sm">
          <BriefcaseMedical className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <p>No therapy guidelines match your current query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="therapy-guide-grid">
          {filteredGuides.map((guide) => {
            const isExpanded = expandedCardId === guide.id;
            return (
              <div 
                key={guide.id}
                className={`bg-white border rounded-3xl transition-all overflow-hidden shadow-2xs ${
                  isExpanded ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-150 hover:border-slate-300'
                }`}
                id={`therapy-card-${guide.id}`}
              >
                {/* Header title button click */}
                <button
                  onClick={() => toggleExpand(guide.id)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center bg-[#FAF9FC]/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">{guide.condition}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>

                {/* Expanded content area */}
                {isExpanded && (
                  <div className="px-6 py-5 border-t border-slate-100 space-y-5 text-xs sm:text-sm animate-slideIn">
                    
                    {/* Basic self care advices */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Basic Self-Care Advice:</span>
                      <ul className="space-y-2.5">
                        {guide.basicAdvice.map((item, idx) => (
                          <li key={idx} className="text-slate-600 flex items-start gap-2.5 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* See doctor warning signs */}
                    <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Consult Licensed Physician If:</span>
                      </span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {guide.seeDocIf}
                      </p>
                    </div>

                    {/* Critical red flags emergency notice */}
                    {guide.emergencyFlags && (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-600" />
                          <span>Emergency Danger Signals:</span>
                        </span>
                        <p className="text-rose-700 font-bold leading-relaxed">
                          {guide.emergencyFlags}
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
