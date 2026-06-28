import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Stethoscope, 
  Activity, 
  Clock, 
  Heart, 
  UserCheck, 
  ArrowRight, 
  CheckCircle,
  MessageSquare,
  Shield,
  Zap,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
}

export default function Home({ setCurrentTab }: HomeProps) {
  return (
    <div className="flex-1 bg-[#FCFBFD]">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-white via-[#FAF5FF] to-[#F3E8FF]">
        {/* Subtle background graphics */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-full text-purple-700 text-xs font-bold shadow-xs"
              >
                <Activity className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span>Rule-Based Expert System Platform</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
              >
                Find The Right <span className="text-purple-600 underline decoration-purple-200 decoration-8 underline-offset-4">Medical Expert</span> For Your Symptoms
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                Enter your symptoms and instantly get expert rule-based guidance on possible conditions, recommended specialists, nearby hospital networks, and therapeutic advice.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => setCurrentTab('checker')}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-purple-200 transition-all flex items-center justify-center gap-2"
                  id="hero-btn-checker"
                >
                  <Sparkles className="w-5 h-5 text-purple-200" />
                  <span>Start Symptom Analysis</span>
                </button>
                <button
                  onClick={() => setCurrentTab('specialists')}
                  className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:text-purple-700 hover:border-purple-200 font-bold px-8 py-4 rounded-xl shadow-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  id="hero-btn-specialists"
                >
                  <Stethoscope className="w-5 h-5 text-slate-400 group-hover:text-purple-500" />
                  <span>Browse Specialists</span>
                </button>
              </motion.div>
            </div>

            {/* Right Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white border-2 border-purple-100 p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-md"
              >
                <div className="absolute -top-6 -left-6 bg-purple-600 text-white p-3 rounded-2xl shadow-md">
                  <Activity className="w-6 h-6" />
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg mb-4 mt-2">Symptom Quick Check</h3>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Selected: Severe Headache & Nausea</span>
                  </div>
                  <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-purple-800">Rule Match Result</span>
                      <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">High Confidence</span>
                    </div>
                    <p className="text-slate-800 font-bold text-sm">Migraine Headache</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Recommended Specialist: <span className="font-bold text-slate-700">Neurologist</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Purely Rule-Based Guidance</span>
                  <span className="font-bold text-purple-600 flex items-center gap-0.5">
                    Safe & Transparent <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-purple-950 text-white py-8 border-y border-purple-900 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-purple-300">500+</p>
              <p className="text-[11px] sm:text-xs font-bold text-purple-200 uppercase tracking-wider">Diseases Modeled</p>
            </div>
            <div className="space-y-1 border-l border-purple-800/60">
              <p className="text-3xl sm:text-4xl font-black text-purple-300">50+</p>
              <p className="text-[11px] sm:text-xs font-bold text-purple-200 uppercase tracking-wider">Specialist Mappings</p>
            </div>
            <div className="space-y-1 border-l border-purple-800/60">
              <p className="text-3xl sm:text-4xl font-black text-purple-300">200+</p>
              <p className="text-[11px] sm:text-xs font-bold text-purple-200 uppercase tracking-wider">Hospitals Registered</p>
            </div>
            <div className="space-y-1 border-l border-purple-800/60">
              <p className="text-3xl sm:text-4xl font-black text-purple-300">10,000+</p>
              <p className="text-[11px] sm:text-xs font-bold text-purple-200 uppercase tracking-wider">Users Guided</p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL DISCLAIMER BANNER */}
      <div className="bg-amber-50 border-y border-amber-200/60 py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-800 font-semibold leading-relaxed">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> This platform is a rule-based expert guidance system and does not provide clinical diagnoses. Always consult a licensed physician in case of real emergencies.
          </span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Structured 3-Step Expert Flow</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
            MedExpert maps symptoms directly to specialized hospital and recovery recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Select Symptoms</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Browse through categorical groups of symptoms or use the smart search to pin down active discomforts.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Get Expert Analysis</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Our rule-based engine compiles symptoms against standard medical mappings to find possible condition matching scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs space-y-4 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">Map Nearby Clinics</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
              Instantly retrieve registered medical centers that host the corresponding specialists and direct contact numbers.
            </p>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED CAPABILITIES */}
      <section className="bg-slate-50/50 py-16 sm:py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Core Features</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
              Built carefully to deliver secure, reliable, and instantaneous healthcare guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Rule-Based Integrity</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Avoids unpredictable matching errors. The logic uses strict deterministic score overlaps.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Instant Diagnosis Mappings</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Processes millions of symptom combinations instantly with a lightweight backend scoring flow.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Hospital Directory</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Direct connection to facilities equipped with specialists like Cardiologists and Neurologists.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">First-Step Self Care</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Basic wellness advices, when to wait, and urgent red flag indicators before clinic arrival.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">No Registration Required</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Designed for instantaneous accessibility. We respect your confidentiality and don't enforce login blocks.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-2xs flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">100% Free Consultation</h4>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  An academic/community service project aiming to digitize health guidance and hospital awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-purple-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Analyze Your Symptoms?</h2>
          <p className="text-purple-200 text-sm sm:text-base max-w-lg mx-auto">
            Take a test and find out what body system requires clinical consultation. Takes less than 1 minute.
          </p>
          <div>
            <button
              onClick={() => setCurrentTab('checker')}
              className="bg-white text-purple-950 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-purple-50 transition-all text-xs sm:text-sm inline-flex items-center gap-2"
              id="cta-bottom-btn"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Check Symptoms Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded-lg text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">MedExpert</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              An elegant, expert rule-based platform providing accurate, safe direction for patients navigating symptoms and specialist routing.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Quick Directory Links</h4>
            <div className="grid grid-cols-2 gap-1 font-semibold">
              <button onClick={() => setCurrentTab('home')} className="text-left hover:text-white transition-colors">Home</button>
              <button onClick={() => setCurrentTab('checker')} className="text-left hover:text-white transition-colors">Symptom Checker</button>
              <button onClick={() => setCurrentTab('specialists')} className="text-left hover:text-white transition-colors">Find Specialists</button>
              <button onClick={() => setCurrentTab('hospitals')} className="text-left hover:text-white transition-colors">Hospitals</button>
              <button onClick={() => setCurrentTab('booking')} className="text-left hover:text-white transition-colors">Book Appointment</button>
              <button onClick={() => setCurrentTab('therapy')} className="text-left hover:text-white transition-colors">Therapy Guide</button>
              <button onClick={() => setCurrentTab('about')} className="text-left hover:text-white transition-colors">About Us</button>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Contact & Working Hours</h4>
            <p className="leading-tight">
              <strong>Phone:</strong> 07033606913 | +234 902 967 5063 <br />
              <strong>Hours:</strong> Mon–Fri 8AM–6PM | Sat 9AM–4PM <br />
              <strong>Sunday:</strong> Emergency Hospital Line Only
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/2347033606913" 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md transition-all flex items-center gap-1.5"
                id="footer-whatsapp-link"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MedExpert. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

// Minimal missing component helper
function HeartPulse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28" />
    </svg>
  );
}
