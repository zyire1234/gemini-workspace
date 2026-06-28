import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Mail className="w-8 h-8 text-purple-600" />
          <span>Contact MedExpert Team</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Have research requests, academic inquiries, or hospital registration updates? Fill out the contact channel below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact details (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-2.5">Clinic Support Channels</h3>

            <div className="space-y-4">
              {/* Phone Line */}
              <div className="flex items-start gap-4 text-xs sm:text-sm">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 font-medium">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Call Support Channels</span>
                  <p className="text-slate-800 font-bold">07033606913</p>
                  <p className="text-slate-600">+234 902 967 5063</p>
                </div>
              </div>

              {/* Email channel */}
              <div className="flex items-start gap-4 text-xs sm:text-sm">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 font-medium">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Academic Email</span>
                  <p className="text-slate-800 font-bold">support@purplevision.com</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 text-xs sm:text-sm">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 font-medium">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Office Working Hours</span>
                  <p className="text-slate-800 font-bold">Mon–Fri: 8:00 AM – 6:00 PM</p>
                  <p className="text-slate-600">Saturday: 9:00 AM – 4:00 PM</p>
                  <p className="text-red-500 font-bold">Sunday: Emergency Services Only</p>
                </div>
              </div>
            </div>

            {/* Float WhatsApp */}
            <div className="pt-4 border-t border-slate-100">
              <a 
                href="https://wa.me/2347033606913"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
                id="contact-whatsapp-direct-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Instant WhatsApp Liaison</span>
              </a>
            </div>

          </div>

          {/* Emergency Alert Box */}
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl space-y-2">
            <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Severe Emergency Advisory Notice</span>
            </h4>
            <p className="text-rose-700 text-xs font-semibold leading-relaxed">
              If you or a nearby patient are suffering from severe crushing chest pain, sudden unilateral numbness, loss of consciousness, or massive bleeding, please immediately contact your local state emergency response unit or proceed directly to the nearest general hospital emergency department! Do not await online messages.
            </p>
          </div>

        </div>

        {/* Right Column: Message form (7/12 width) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-2.5">Send a Message</h3>

            {isSent && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-start gap-2.5 text-xs font-bold animate-slideIn">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <span className="block">Message Delivered Successfully!</span>
                  <span className="font-medium text-[11px] text-emerald-600">The expert system support coordinator has queued your message and will review it soon.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Email Address</label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inquiry / Message Details</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Draft your inquiry here..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-all font-semibold resize-none"
                />
              </div>

              {/* Submit btn */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-purple-200 transition-all text-xs"
                  id="btn-contact-submit"
                >
                  <Send className="w-4 h-4 text-purple-200" />
                  <span>Send Message Now</span>
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
