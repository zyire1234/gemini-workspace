import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Stethoscope, 
  MapPin, 
  Clipboard, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { Specialist, Hospital } from '../types';

interface BookingProps {
  preselectedSpecialistId?: string;
  setPreselectedSpecialistId?: (id: string) => void;
  preselectedHospitalId?: string;
  setPreselectedHospitalId?: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Booking({ 
  preselectedSpecialistId = '', 
  setPreselectedSpecialistId,
  preselectedHospitalId = '',
  setPreselectedHospitalId,
  setCurrentTab 
}: BookingProps) {
  
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  
  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(preselectedSpecialistId);
  const [selectedHospitalId, setSelectedHospitalId] = useState(preselectedHospitalId);
  const [reason, setReason] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load specialists and hospitals
  useEffect(() => {
    fetch('/api/specialists')
      .then(res => res.json())
      .then(data => setSpecialists(data))
      .catch(err => console.error("Error loading specialists:", err));

    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(err => console.error("Error loading hospitals:", err));
  }, []);

  // Update selected specialist state if prop changes
  useEffect(() => {
    if (preselectedSpecialistId) {
      setSelectedSpecialistId(preselectedSpecialistId);
    }
  }, [preselectedSpecialistId]);

  // Update selected hospital state if prop changes
  useEffect(() => {
    if (preselectedHospitalId) {
      setSelectedHospitalId(preselectedHospitalId);
    }
  }, [preselectedHospitalId]);

  // Dynamic Filtering: Find hospitals that support the selected specialist
  const availableFilteredHospitals = selectedSpecialistId
    ? hospitals.filter(h => h.availableSpecialists.includes(selectedSpecialistId))
    : hospitals;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const bookingData = {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      specialistId: selectedSpecialistId,
      reason
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete appointment booking.');
      }

      const savedBooking = await response.json();
      setSuccessBooking(savedBooking);
      
      // Clear props
      if (setPreselectedSpecialistId) setPreselectedSpecialistId('');
      if (setPreselectedHospitalId) setPreselectedHospitalId('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Server connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSpecialistObj = specialists.find(s => s.id === selectedSpecialistId);
  const selectedHospitalObj = hospitals.find(h => h.id === selectedHospitalId);

  // SUCCESS COMPONENT
  if (successBooking) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4 animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-full inline-flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Successfully Booked!</h2>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
              A simulated SMTP email confirmation has been dispatched to <span className="font-bold text-purple-700">{successBooking.patientEmail}</span> and <span className="font-bold text-purple-700">Workwithmyrie@gmail.com</span>.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left divide-y divide-slate-200 space-y-3.5">
            <div className="pt-0 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Booking Ref:</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2.5 py-1 rounded-md">{successBooking.id}</span>
            </div>
            
            <div className="pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Patient Name:</span>
                <span className="font-bold text-slate-900">{successBooking.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Phone Contact:</span>
                <span className="font-bold text-slate-900">{successBooking.patientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Date &amp; Time:</span>
                <span className="font-bold text-purple-700">{successBooking.appointmentDate} at {successBooking.appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Specialist:</span>
                <span className="font-bold text-slate-900">{selectedSpecialistObj?.title || successBooking.specialistId}</span>
              </div>
              {selectedHospitalObj && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Hospital Center:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedHospitalObj.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSuccessBooking(null);
                setPatientName('');
                setPatientEmail('');
                setPatientPhone('');
                setAppointmentDate('');
                setAppointmentTime('');
                setSelectedSpecialistId('');
                setSelectedHospitalId('');
                setReason('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs transition-colors"
            >
              Book Another Appointment
            </button>
            <button
              onClick={() => setCurrentTab('home')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md hover:shadow-purple-100 flex items-center justify-center gap-1.5"
            >
              <span>Return Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-purple-600" />
          <span>Book Medical Consultation</span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Choose a medical specialist, select your preferred date/time, and enter your details. Maryam (Admin) will be instantly notified.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2">1. Patient Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="text"
                      required
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="e.g. Maryam Bello"
                      className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      placeholder="e.g. 08023456789"
                      className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input 
                    type="email"
                    required
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    placeholder="e.g. pat@example.com"
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Choice */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2">2. Clinical Specialist &amp; Facility</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Specialist dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Specialist</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <Stethoscope className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <select
                      required
                      value={selectedSpecialistId}
                      onChange={e => {
                        setSelectedSpecialistId(e.target.value);
                        setSelectedHospitalId(''); // reset hospital on specialist change
                      }}
                      className="w-full bg-transparent text-slate-800 focus:outline-none font-semibold cursor-pointer"
                    >
                      <option value="">-- Choose Specialist --</option>
                      {specialists.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hospital dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipped Hospital Center</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <select
                      value={selectedHospitalId}
                      onChange={e => setSelectedHospitalId(e.target.value)}
                      className="w-full bg-transparent text-slate-800 focus:outline-none font-semibold cursor-pointer"
                    >
                      <option value="">-- Optional (Any Equipped Clinic) --</option>
                      {availableFilteredHospitals.map(hosp => (
                        <option key={hosp.id} value={hosp.id}>{hosp.name} ({hosp.state})</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {selectedSpecialistId && availableFilteredHospitals.length === 0 && (
                <p className="text-[11px] text-amber-600 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>No specific hospitals registered yet with an active {selectedSpecialistObj?.title} department. Booking will be routed as an open consult referral.</span>
                </p>
              )}
            </div>

            {/* Section 3: Time and Notes */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2">3. Preferred Schedule</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointment Date</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input 
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                      className="w-full bg-transparent text-slate-800 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Time Slot</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                    <Clock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <select
                      required
                      value={appointmentTime}
                      onChange={e => setAppointmentTime(e.target.value)}
                      className="w-full bg-transparent text-slate-800 focus:outline-none font-semibold cursor-pointer"
                    >
                      <option value="">-- Choose Time --</option>
                      <option value="09:00 AM">09:00 AM (Morning Session)</option>
                      <option value="10:30 AM">10:30 AM (Morning Session)</option>
                      <option value="12:00 PM">12:00 PM (Midday Session)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon Session)</option>
                      <option value="03:30 PM">03:30 PM (Afternoon Session)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reason for Consultation (Symptoms/Notes)</label>
                <div className="flex items-start bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                  <Clipboard className="w-4 h-4 text-slate-400 mr-2 shrink-0 mt-1" />
                  <textarea 
                    rows={3}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for wanting to meet this specialist..."
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none font-semibold resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-purple-100 flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Appointment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                  <span>Confirm Consultation Booking</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Dynamic Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-purple-950 text-white p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <HeartPulse className="w-40 h-40" />
            </div>

            <h4 className="font-extrabold text-sm sm:text-base">MedExpert Scheduling Policy</h4>
            <ul className="space-y-3 text-xs text-purple-200 font-semibold leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Confirmations are simulated via a console logs and email dispatch to Workwithmyrie@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>You can view, confirm, or cancel your appointments within the Admin Dashboard console.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>No initial payment or card registration required. Direct connection to Nigerian medical networks.</span>
              </li>
            </ul>
          </div>

          {selectedSpecialistObj && (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-700">Specialty Highlights</h4>
              <p className="font-black text-slate-850 text-sm leading-normal">{selectedSpecialistObj.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{selectedSpecialistObj.description}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Common Conditions Treated:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSpecialistObj.conditionsTreated.map((c, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
