import React from 'react';
import { BookOpen, ShieldCheck, HeartPulse, Activity, Terminal, GraduationCap, Code } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-purple-600" />
          <span>About MedExpert</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Meet the creator, understand the project mission, and explore the rules-based architecture behind MedExpert.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Creator Card (4 Cols) */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Developer Profile
          </span>
          
          {/* Photo Space with Elegant Frame */}
          <div className="relative mx-auto w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm flex items-center justify-center">
            <img 
              src="/Maryam.jpg" 
              alt="Maryam" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // If Maryam.jpg is not uploaded yet or fails to load, render a gorgeous avatar placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = document.getElementById('image-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }
              }}
            />
            {/* Fallback Beautiful Placeholder */}
            <div 
              id="image-placeholder" 
              className="absolute inset-0 hidden flex-col items-center justify-center bg-gradient-to-tr from-purple-100 to-indigo-50 text-purple-600 space-y-2 p-4"
            >
              <div className="bg-purple-600 text-white p-3 rounded-full shadow-md">
                <GraduationCap className="w-8 h-8" />
              </div>
              <span className="font-bold text-xs text-purple-800">Maryam.jpg</span>
              <span className="text-[10px] text-slate-400 font-semibold max-w-xs text-center">Place your Maryam.jpg in the public folder</span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Maryam</h2>
            <p className="text-xs text-purple-600 font-black uppercase tracking-wide">Computer Scientist</p>
            <p className="text-[11px] text-slate-400 font-semibold">Specialist Design Systems &amp; Development</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
              <span>Final Year Project</span>
            </span>
          </div>
        </div>

        {/* Project Mission & Bio (8 Cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-4 text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
            
            <p className="text-slate-900 text-sm sm:text-base font-extrabold border-b border-slate-100 pb-3">
              Project Conception &amp; Creator Statement
            </p>

            <p>
              I am Maryam, a Computer Scientist with a strong interest in design systems and full project development. 
              <strong> MedExpert</strong> is my final year project, built around a real and pressing problem in healthcare accessibility in Nigeria.
            </p>

            <p>
              In many cases, the challenge in Nigerian healthcare is not the absence of doctors, but knowing where to begin. 
              Patients often struggle with identifying the right hospital, choosing the correct specialist, or seeking help early enough before conditions worsen. 
              This delay or misdirection can lead to avoidable complications.
            </p>

            <p>
              MedExpert is designed to bridge that gap by providing a clear and guided starting point. 
              Users can describe their symptoms, and the system suggests possible conditions, recommends the appropriate type of specialist, and helps locate Nigerian hospitals where such specialists are available. 
              It also provides basic self-care guidance while users wait to see a medical professional.
            </p>

            <p className="text-slate-700 italic border-l-2 border-purple-500 pl-3 bg-purple-50/40 py-2 rounded-r-lg">
              "The goal of MedExpert is not to replace medical professionals, but to make healthcare navigation simpler, faster, and more informed helping users take the right first step toward getting the care they need."
            </p>
          </div>
        </div>

      </div>

      {/* Behind the Technology */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* System Diagram explanation */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600 animate-pulse" />
            <span>How the Rule Engine Computes Overlaps</span>
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            To ensure accuracy and safety, MedExpert maps user-selected active discomforts directly using deterministic set logic:
          </p>
          
          {/* Simulated ASCII Flow Diagram */}
          <div className="bg-slate-900 text-purple-300 p-5 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-850 space-y-2">
            <div className="text-purple-400 font-extrabold"># Expert Rule-Matching Formula</div>
            <div>[User Selected Symptoms] &cap; [Disease Symptom Template] = [Match Count]</div>
            <div>Overlap Score = Match Count / Total Template Symptoms</div>
            <div>Final Score = Overlap Score &times; Rule Confidence Weight</div>
            <div className="pt-2 text-slate-400">// Output: Matches sorted in real-time by descending percentage score.</div>
          </div>
        </div>

        {/* Tech Stack list */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600" />
            <span>Technical Frameworks</span>
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            MedExpert leverages a highly optimized and modern technical stack:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Frontend Library</span>
              <span className="text-slate-800">React 19 &amp; TypeScript</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Design System</span>
              <span className="text-slate-800">Tailwind CSS 4</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Animations</span>
              <span className="text-slate-800">Framer Motion</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Backend Engine</span>
              <span className="text-slate-800">Node.js + Express.js</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Database Persistence</span>
              <span className="text-slate-800">Secure JSON File Engine</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
              <span className="text-slate-400 block font-mono">Clinical Integrity</span>
              <span className="text-slate-800">Deterministic Rules Grid</span>
            </div>
          </div>
        </div>

        {/* Academic Context Disclaimer */}
        <div className="border-t border-slate-100 pt-6 bg-purple-50/50 p-5 rounded-2xl border border-purple-100 space-y-2">
          <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Academic Verification</span>
          </h4>
          <p className="text-purple-950 text-xs sm:text-sm font-medium leading-relaxed">
            This workspace constitutes a fully functional production-ready final year defense model. Updates made in the Admin Dashboard console dynamically write to the secure database core, allowing researchers and defense panels to test symptom validation behaviors instantly.
          </p>
        </div>

      </div>

    </div>
  );
}
