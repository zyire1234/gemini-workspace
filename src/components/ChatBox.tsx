import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, HeartPulse, Sparkles, AlertCircle, Phone, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import { INITIAL_SYMPTOMS, INITIAL_HOSPITALS, INITIAL_SPECIALISTS, INITIAL_THERAPY_GUIDES } from '../data/initialData';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  chips?: string[];
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! Welcome to MedExpert Support. I am your automated Clinical Support Assistant. How can I help you today?",
      timestamp: new Date(),
      chips: ['🔍 Check Symptom', '🏥 Find Hospital', '🩺 Specialist Directory', '💡 Therapy Tip']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Process matching logic after simulated delay
    setTimeout(() => {
      const botResponse = generateBotResponse(textToSend);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 750);
  };

  const handleChipClick = (chipText: string) => {
    // Treat chip click as a sent message
    handleSendMessage(chipText);
  };

  const generateBotResponse = (input: string): Message => {
    const cleanInput = input.toLowerCase().trim();
    const id = Date.now().toString();
    const timestamp = new Date();

    // 1. CHIP CLICKS / EXPLICIT STARTERS
    if (cleanInput.includes('check symptom') || cleanInput === 'symptom') {
      return {
        id,
        sender: 'bot',
        text: "Please tell me what symptoms you are feeling. You can type keywords like: **fever**, **headache**, **cough**, **chest pain**, **stomach pain**, **vomiting**, **dizziness**, or **itching**.",
        timestamp,
        chips: ['Fever', 'Headache', 'Chest Pain', 'Stomach Pain']
      };
    }

    if (cleanInput.includes('find hospital') || cleanInput === 'hospital') {
      return {
        id,
        sender: 'bot',
        text: "Which state in Nigeria are you currently searching in? You can type the state name, such as: **Lagos**, **Abuja**, **Enugu**, **Kano**, **Rivers**, **Oyo**, or **Delta**.",
        timestamp,
        chips: ['Lagos', 'Abuja', 'Enugu', 'Rivers']
      };
    }

    if (cleanInput.includes('specialist directory') || cleanInput === 'specialist') {
      return {
        id,
        sender: 'bot',
        text: "Which clinical field or doctor type do you need? You can type common fields like: **Cardiologist**, **Neurologist**, **Dermatologist**, **Gynecologist**, **Pediatrician**, or **Urologist**.",
        timestamp,
        chips: ['Cardiologist', 'Neurologist', 'Gynecologist', 'Pediatrician']
      };
    }

    if (cleanInput.includes('therapy tip') || cleanInput === 'therapy' || cleanInput === 'tip') {
      return {
        id,
        sender: 'bot',
        text: "Which clinical condition do you need a supportive first-aid/therapy guide for? (e.g. **Migraine**, **Asthma**, **Gastritis**, **Hypertension**, **Malaria**, or **Typhoid**).",
        timestamp,
        chips: ['Malaria Guide', 'Migraine Guide', 'Asthma Guide']
      };
    }

    // 2. CHECK STATES & CITIES FOR HOSPITALS
    const states = ['lagos', 'abuja', 'enugu', 'kano', 'rivers', 'oyo', 'delta', 'kaduna', 'imo'];
    const matchedState = states.find(s => cleanInput.includes(s));
    if (matchedState) {
      const stateName = matchedState === 'fct abuja' || matchedState === 'abuja' ? 'fct abuja' : matchedState;
      const filteredHospitals = INITIAL_HOSPITALS.filter(h => 
        h.state.toLowerCase().includes(stateName) || h.city.toLowerCase().includes(stateName)
      );

      if (filteredHospitals.length > 0) {
        let text = `Here are the registered specialized medical centers found in **${filteredHospitals[0].state}**:\n\n`;
        filteredHospitals.forEach((h, index) => {
          text += `${index + 1}. **${h.name}**\n📍 *${h.city}* — ${h.address}\n📞 Contact: **${h.phone}**\n\n`;
        });
        text += "You can use the **Hospital Search** tab at the top to filter these hospitals dynamically by specialists and view them on the map!";
        return { id, sender: 'bot', text, timestamp };
      }
    }

    // 3. CHECK SYMPTOMS MATCH
    const matchedSymptom = INITIAL_SYMPTOMS.find(s => 
      cleanInput.includes(s.name.toLowerCase()) || 
      cleanInput.includes(s.id.replace('sym_', '').replace('_', ' ')) ||
      s.name.toLowerCase().split(' ').some(word => word.length > 3 && cleanInput.includes(word))
    );

    if (matchedSymptom) {
      // Find related specialists for this symptom category
      // Hardcode some intuitive maps or search specialist treated list
      let recommendation = "General Practitioner";
      let specialistId = "spec_gp";

      if (matchedSymptom.category === 'Head & Neurological') { recommendation = "Neurologist"; specialistId = "spec_neurologist"; }
      else if (matchedSymptom.category === 'Chest & Respiratory') { recommendation = "Pulmonologist / Cardiologist"; specialistId = "spec_pulmonologist"; }
      else if (matchedSymptom.category === 'Digestive') { recommendation = "Gastroenterologist"; specialistId = "spec_gastroenterologist"; }
      else if (matchedSymptom.category === 'Skin') { recommendation = "Dermatologist"; specialistId = "spec_dermatologist"; }
      else if (matchedSymptom.category === 'Eyes & Vision') { recommendation = "Ophthalmologist"; specialistId = "spec_ophthalmologist"; }
      else if (matchedSymptom.name.includes('Urination') || matchedSymptom.name.includes('Urine')) { recommendation = "Urologist"; specialistId = "spec_urologist"; }
      else if (matchedSymptom.name.includes('Menstrual') || matchedSymptom.name.includes('Pelvic')) { recommendation = "Gynecologist"; specialistId = "spec_gynecologist"; }

      const text = `I detected your reference to **${matchedSymptom.name}** (*${matchedSymptom.category}*).\n\nBased on our medical rules, this indicator points towards consulting a **${recommendation}**.\n\nWould you like to run a comprehensive check on the **Symptom Checker** page? It allows you to select multiple discomforts simultaneously to compute strict deterministic likelihoods.`;

      return {
        id,
        sender: 'bot',
        text,
        timestamp,
        chips: ['🩺 Specialist Directory', '🏥 Find Hospital']
      };
    }

    // 4. CHECK SPECIALISTS MATCH
    const matchedSpecialist = INITIAL_SPECIALISTS.find(s => 
      cleanInput.includes(s.title.toLowerCase()) || 
      cleanInput.includes(s.id.replace('spec_', '').replace('_', ' '))
    );

    if (matchedSpecialist) {
      const treating = matchedSpecialist.conditionsTreated.join(', ');
      // find hospitals supporting this specialist
      const supportingHospitals = INITIAL_HOSPITALS.filter(h => h.availableSpecialists.includes(matchedSpecialist.id)).slice(0, 3);
      let text = `**${matchedSpecialist.title}** Specialist Profile:\n\n*Description*: ${matchedSpecialist.description}\n\n*Conditions treated*: ${treating}\n\n*Top Facilities offering this department*:\n`;
      supportingHospitals.forEach(h => {
        text += `• **${h.name}** (${h.state})\n`;
      });
      text += "\nYou can book an appointment with this department directly under our **Book Appointment** tab!";
      return { id, sender: 'bot', text, timestamp };
    }

    // 5. CHECK THERAPY MATCH
    const matchedTherapy = INITIAL_THERAPY_GUIDES.find(tg => 
      cleanInput.includes(tg.condition.toLowerCase()) || 
      tg.condition.toLowerCase().split(' ').some(word => word.length > 4 && cleanInput.includes(word))
    );

    if (matchedTherapy) {
      let adviceText = `🛡️ **Therapeutic First Aid Guide: ${matchedTherapy.condition}**\n\n`;
      adviceText += `**Immediate Basic Advice:**\n`;
      matchedTherapy.basicAdvice.forEach(adv => {
        adviceText += `• ${adv}\n`;
      });
      adviceText += `\n**Consult Doctor if:** ${matchedTherapy.seeDocIf}\n\n`;
      adviceText += `**${matchedTherapy.emergencyFlags}**`;

      return {
        id,
        sender: 'bot',
        text: adviceText,
        timestamp
      };
    }

    // Default Fallback
    return {
      id,
      sender: 'bot',
      text: "I want to make sure I assist you perfectly. You can search directly by typing a clinical symptom (e.g. *fever*, *cough*), a Nigerian state (e.g. *Lagos* or *Abuja* to find hospitals), or a doctor's specialty (e.g. *Cardiologist*). Alternatively, please choose one of the options below:",
      timestamp,
      chips: ['🔍 Check Symptom', '🏥 Find Hospital', '🩺 Specialist Directory', '💡 Therapy Tip']
    };
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        id="chat-floating-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white p-3.5 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group"
        title="Open clinical support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-purple-600 rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Main Chat Box Window Container */}
      {isOpen && (
        <div
          id="chat-window-container"
          className="absolute bottom-24 right-4 left-4 h-[440px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-fade-in-up"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600/20 p-1.5 rounded-xl text-purple-400">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  MedExpert Support Chat
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Deterministic Expert System
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-1.5 shrink-0 text-[10px] text-amber-800 leading-tight">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Deterministic guidance only:</strong> This automated channel is mapped directly to registered clinical criteria. It is not an actual diagnosis or replacement for physical doctor care.
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                      ME
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Optional Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-9 justify-start">
                    {msg.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/50 hover:border-purple-300 text-[10px] font-bold py-1 px-2.5 rounded-full transition-all active:scale-95 flex items-center gap-0.5"
                      >
                        {chip} <ChevronRight className="w-3 h-3 text-purple-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 pl-9">
                <div className="bg-purple-100 text-purple-700 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search symptom, state, or specialist..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-2xl transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
