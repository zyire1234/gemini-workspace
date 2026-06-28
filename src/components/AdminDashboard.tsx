import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  User, 
  Key, 
  Activity, 
  Plus, 
  Trash2, 
  Edit, 
  FolderSync, 
  ActivitySquare, 
  MapPin, 
  Phone, 
  Stethoscope, 
  BriefcaseMedical,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Symptom, Disease, Specialist, Hospital, TherapyGuide, Rule, Appointment } from '../types';

interface AdminDashboardProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

type AdminTab = 'symptoms' | 'diseases' | 'specialists' | 'hospitals' | 'therapy' | 'rules' | 'appointments';

export default function AdminDashboard({ isAdminLoggedIn, setIsAdminLoggedIn }: AdminDashboardProps) {
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Loaded database lists
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [therapyGuides, setTherapyGuides] = useState<TherapyGuide[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Active module tab
  const [activeTab, setActiveTab] = useState<AdminTab>('symptoms');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Specific form values
  const [symptomForm, setSymptomForm] = useState({ name: '', category: 'Head & Neurological' as any });
  const [diseaseForm, setDiseaseForm] = useState({ name: '', description: '', urgencyLevel: 'Medium' as any });
  const [specialistForm, setSpecialistForm] = useState({ title: '', description: '', conditionsTreatedRaw: '' });
  const [hospitalForm, setHospitalForm] = useState({ name: '', state: '', city: '', address: '', phone: '', googleMapsLink: '', availableSpecialistIds: [] as string[] });
  const [therapyForm, setTherapyForm] = useState({ condition: '', basicAdviceRaw: '', seeDocIf: '', emergencyFlags: '' });
  const [ruleForm, setRuleForm] = useState({ symptomIds: [] as string[], diseaseId: '', specialistId: '', confidenceScore: 0.8 });

  // System status messages
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // Run on load or on authentication
  useEffect(() => {
    const token = localStorage.getItem('purple_admin_token');
    if (token === 'purple-vision-secure-admin-token-2026') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
    }
  }, [isAdminLoggedIn]);

  // Load resources from backend API
  const loadAllData = async () => {
    const token = 'purple-vision-secure-admin-token-2026';
    const authHeader = { 'Authorization': `Bearer ${token}` };

    try {
      // Symptoms
      const symRes = await fetch('/api/symptoms');
      const symData = await symRes.json();
      setSymptoms(symData);

      // Diseases
      const disRes = await fetch('/api/admin/diseases', { headers: authHeader });
      const disData = await disRes.json();
      setDiseases(disData);

      // Specialists
      const specRes = await fetch('/api/specialists');
      const specData = await specRes.json();
      setSpecialists(specData);

      // Hospitals
      const hospRes = await fetch('/api/hospitals');
      const hospData = await hospRes.json();
      setHospitals(hospData);

      // Therapy Guides
      const tgRes = await fetch('/api/admin/therapy', { headers: authHeader });
      const tgData = await tgRes.json();
      setTherapyGuides(tgData);

      // Rules
      const rRes = await fetch('/api/admin/rules', { headers: authHeader });
      const rData = await rRes.json();
      setRules(rData);

      // Appointments
      const apptRes = await fetch('/api/admin/appointments', { headers: authHeader });
      const apptData = await apptRes.json();
      setAppointments(apptData);

    } catch (err) {
      console.error(err);
      setAuthError("Failed to fetch full-stack clinical list state. Try re-logging in.");
    }
  };

  const handleUpdateAppointmentStatus = async (apptId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    const token = 'purple-vision-secure-admin-token-2026';
    const authHeader = { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };
    try {
      const res = await fetch(`/api/admin/appointments/${apptId}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showStatus(`Appointment status successfully marked as ${status}.`);
        loadAllData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update appointment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (apptId: string) => {
    if (!window.confirm("Delete this appointment record permanently? This cannot be undone.")) return;
    const token = 'purple-vision-secure-admin-token-2026';
    const authHeader = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`/api/admin/appointments/${apptId}`, {
        method: 'DELETE',
        headers: authHeader
      });
      if (res.ok) {
        showStatus("Appointment deleted permanently.");
        loadAllData();
      } else {
        alert("Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unauthorized credentials.');
      }

      const data = await response.json();
      localStorage.setItem('purple_admin_token', data.token);
      setIsAdminLoggedIn(true);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Verification failed. Try admin@purplevision.com with correct password.');
    }
  };

  const showStatus = (text: string) => {
    setSystemMessage(text);
    setTimeout(() => setSystemMessage(null), 4000);
  };

  // Helper auth headers
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer purple-vision-secure-admin-token-2026`
    };
  };

  // Delete Action Trigger
  const handleDelete = async (endpoint: string, targetId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this diagnostic resource from active system database?")) return;

    try {
      const response = await fetch(`/api/admin/${endpoint}/${targetId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Deletion failed.");
      
      showStatus("Resource removed successfully.");
      loadAllData();
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to remove item.");
    }
  };

  // Open Edit Dialog
  const openEdit = (tab: AdminTab, item: any) => {
    setEditId(item.id);
    setIsFormOpen(true);

    if (tab === 'symptoms') {
      setSymptomForm({ name: item.name, category: item.category });
    } else if (tab === 'diseases') {
      setDiseaseForm({ name: item.name, description: item.description, urgencyLevel: item.urgencyLevel });
    } else if (tab === 'specialists') {
      setSpecialistForm({ title: item.title, description: item.description, conditionsTreatedRaw: item.conditionsTreated.join(', ') });
    } else if (tab === 'hospitals') {
      setHospitalForm({ 
        name: item.name, 
        state: item.state, 
        city: item.city, 
        address: item.address, 
        phone: item.phone, 
        googleMapsLink: item.googleMapsLink, 
        availableSpecialistIds: item.availableSpecialists || [] 
      });
    } else if (tab === 'therapy') {
      setTherapyForm({ 
        condition: item.condition, 
        basicAdviceRaw: item.basicAdvice.join('\n'), 
        seeDocIf: item.seeDocIf, 
        emergencyFlags: item.emergencyFlags 
      });
    } else if (tab === 'rules') {
      setRuleForm({ 
        symptomIds: item.symptomIds || [], 
        diseaseId: item.diseaseId, 
        specialistId: item.specialistId, 
        confidenceScore: item.confidenceScore 
      });
    }
  };

  // Open Create Dialog
  const openCreate = () => {
    setEditId(null);
    setIsFormOpen(true);
    // Clear forms
    setSymptomForm({ name: '', category: 'Head & Neurological' });
    setDiseaseForm({ name: '', description: '', urgencyLevel: 'Medium' });
    setSpecialistForm({ title: '', description: '', conditionsTreatedRaw: '' });
    setHospitalForm({ name: '', state: '', city: '', address: '', phone: '', googleMapsLink: '', availableSpecialistIds: [] });
    setTherapyForm({ condition: '', basicAdviceRaw: '', seeDocIf: '', emergencyFlags: '' });
    setRuleForm({ symptomIds: [], diseaseId: diseases[0]?.id || '', specialistId: specialists[0]?.id || '', confidenceScore: 0.8 });
  };

  // Submit Handler for Forms
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    let body: any = {};
    let endpoint = '';

    if (activeTab === 'symptoms') {
      body = symptomForm;
      endpoint = 'symptoms';
    } else if (activeTab === 'diseases') {
      body = diseaseForm;
      endpoint = 'diseases';
    } else if (activeTab === 'specialists') {
      body = {
        title: specialistForm.title,
        description: specialistForm.description,
        conditionsTreated: specialistForm.conditionsTreatedRaw.split(',').map(s => s.trim()).filter(Boolean)
      };
      endpoint = 'specialists';
    } else if (activeTab === 'hospitals') {
      body = {
        name: hospitalForm.name,
        state: hospitalForm.state,
        city: hospitalForm.city,
        address: hospitalForm.address,
        phone: hospitalForm.phone,
        googleMapsLink: hospitalForm.googleMapsLink,
        availableSpecialists: hospitalForm.availableSpecialistIds
      };
      endpoint = 'hospitals';
    } else if (activeTab === 'therapy') {
      body = {
        condition: therapyForm.condition,
        basicAdvice: therapyForm.basicAdviceRaw.split('\n').map(s => s.trim()).filter(Boolean),
        seeDocIf: therapyForm.seeDocIf,
        emergencyFlags: therapyForm.emergencyFlags
      };
      endpoint = 'therapy';
    } else if (activeTab === 'rules') {
      body = ruleForm;
      endpoint = 'rules';
    }

    try {
      let response;
      if (editId) {
        // Edit Put
        response = await fetch(`/api/admin/${endpoint}/${editId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });
      } else {
        // Create Post
        response = await fetch(`/api/admin/${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
      }

      if (!response.ok) throw new Error("Action failed on clinical database server.");

      showStatus("Database records updated successfully.");
      setIsFormOpen(false);
      setEditId(null);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to commit details.");
    }
  };

  const toggleHospitalSpecialist = (id: string) => {
    const list = [...hospitalForm.availableSpecialistIds];
    if (list.includes(id)) {
      setHospitalForm({ ...hospitalForm, availableSpecialistIds: list.filter(i => i !== id) });
    } else {
      setHospitalForm({ ...hospitalForm, availableSpecialistIds: [...list, id] });
    }
  };

  const toggleRuleSymptom = (id: string) => {
    const list = [...ruleForm.symptomIds];
    if (list.includes(id)) {
      setRuleForm({ ...ruleForm, symptomIds: list.filter(i => i !== id) });
    } else {
      setRuleForm({ ...ruleForm, symptomIds: [...list, id] });
    }
  };


  // ==================== RENDER LOCK GATE LOGIN ====================
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-full inline-flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Protected Admin Gate</h2>
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              Authentication required to edit diagnostic symptom rules, hospitals, and clinical advice mappings.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admin Email Address</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@purplevision.com"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access Password</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-purple-600 rounded-xl px-3.5 py-2.5">
                <Key className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-purple-100"
            >
              Verify &amp; Unlock Console
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-400 font-mono">Credentials: admin@purplevision.com / admin123</span>
          </div>

        </div>
      </div>
    );
  }

  // ==================== RENDER ADMIN CONSOLE ====================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-5 rounded-3xl shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 text-white rounded-2xl animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">MedExpert Clinical Control Center</h1>
            <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider font-mono">Expert System Registry Management</p>
          </div>
        </div>

        <button 
          onClick={loadAllData}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <FolderSync className="w-4 h-4" />
          <span>Reload Registry</span>
        </button>
      </div>

      {/* SYSTEM FEEDBACKS */}
      {systemMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold rounded-2xl animate-slideIn">
          {systemMessage}
        </div>
      )}

      {authError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold rounded-2xl">
          {authError}
        </div>
      )}

      {/* DASHBOARD STATISTICS COUNTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] text-slate-400 font-black uppercase">Active Symptoms</span>
          <p className="text-2xl font-black text-slate-900">{symptoms.length}</p>
        </div>
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] text-slate-400 font-black uppercase">Modelled Diseases</span>
          <p className="text-2xl font-black text-slate-900">{diseases.length}</p>
        </div>
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] text-slate-400 font-black uppercase">Hospitals Listed</span>
          <p className="text-2xl font-black text-slate-900">{hospitals.length}</p>
        </div>
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] text-slate-400 font-black uppercase">Active Rules</span>
          <p className="text-2xl font-black text-slate-900">{rules.length}</p>
        </div>
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs col-span-2 lg:col-span-1">
          <span className="text-[10px] text-slate-400 font-black uppercase">Consult Bookings</span>
          <p className="text-2xl font-black text-purple-700">{appointments.length}</p>
        </div>
      </div>

      {/* TABS CONTROL MATRIX */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
        {(['symptoms', 'diseases', 'specialists', 'hospitals', 'therapy', 'rules', 'appointments'] as AdminTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsFormOpen(false);
            }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all shrink-0 capitalize ${
              activeTab === tab 
                ? 'bg-purple-600 border-purple-700 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EDIT / CREATE COMPACT FORM OVERLAY */}
      {isFormOpen && (
        <div className="bg-purple-50/50 border-2 border-purple-200 p-5 sm:p-6 rounded-3xl space-y-6 animate-slideIn">
          <div className="flex justify-between items-center border-b border-purple-200/60 pb-3">
            <h3 className="font-extrabold text-purple-900 text-sm sm:text-base">
              {editId ? 'Modify Registered Record' : 'Create New Registry Record'} ({activeTab})
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
            
            {/* SYMPTOMS FORM */}
            {activeTab === 'symptoms' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Symptom Name</label>
                  <input 
                    type="text" 
                    required 
                    value={symptomForm.name} 
                    onChange={e => setSymptomForm({ ...symptomForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none"
                    placeholder="e.g. Sharp Chest Pain"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Body Category</label>
                  <select
                    value={symptomForm.category}
                    onChange={e => setSymptomForm({ ...symptomForm, category: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none"
                  >
                    <option value="Head & Neurological">Head & Neurological</option>
                    <option value="Chest & Respiratory">Chest & Respiratory</option>
                    <option value="Digestive">Digestive</option>
                    <option value="Skin">Skin</option>
                    <option value="Eyes & Vision">Eyes & Vision</option>
                    <option value="Musculoskeletal">Musculoskeletal</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            )}

            {/* DISEASES FORM */}
            {activeTab === 'diseases' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Disease Name</label>
                    <input 
                      type="text" 
                      required 
                      value={diseaseForm.name} 
                      onChange={e => setDiseaseForm({ ...diseaseForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none"
                      placeholder="e.g. Acute Gastritis"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Urgency Level</label>
                    <select
                      value={diseaseForm.urgencyLevel}
                      onChange={e => setDiseaseForm({ ...diseaseForm, urgencyLevel: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none font-semibold"
                    >
                      <option value="Low">Low (Routine Clinic Consultation)</option>
                      <option value="Medium">Medium (Doctor check within 48h)</option>
                      <option value="High">High (EMERGENCY Danger signs)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description Details</label>
                  <textarea 
                    required 
                    rows={3}
                    value={diseaseForm.description} 
                    onChange={e => setDiseaseForm({ ...diseaseForm, description: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none resize-none"
                    placeholder="Short description of condition..."
                  />
                </div>
              </div>
            )}

            {/* SPECIALISTS FORM */}
            {activeTab === 'specialists' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Specialty Title</label>
                  <input 
                    type="text" 
                    required 
                    value={specialistForm.title} 
                    onChange={e => setSpecialistForm({ ...specialistForm, title: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none"
                    placeholder="e.g. Neurologist"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Treated Conditions (comma separated)</label>
                  <input 
                    type="text" 
                    required 
                    value={specialistForm.conditionsTreatedRaw} 
                    onChange={e => setSpecialistForm({ ...specialistForm, conditionsTreatedRaw: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none"
                    placeholder="Migraine, Stroke, Neuropathy, Epilepsy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Specialist Core Description</label>
                  <textarea 
                    required 
                    rows={3}
                    value={specialistForm.description} 
                    onChange={e => setSpecialistForm({ ...specialistForm, description: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none resize-none"
                    placeholder="Describe their medical role..."
                  />
                </div>
              </div>
            )}

            {/* HOSPITALS FORM */}
            {activeTab === 'hospitals' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hospital Name</label>
                    <input 
                      type="text" 
                      required 
                      value={hospitalForm.name} 
                      onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">State</label>
                    <input 
                      type="text" 
                      required 
                      value={hospitalForm.state} 
                      onChange={e => setHospitalForm({ ...hospitalForm, state: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                      placeholder="e.g. Lagos"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                    <input 
                      type="text" 
                      required 
                      value={hospitalForm.city} 
                      onChange={e => setHospitalForm({ ...hospitalForm, city: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                      placeholder="e.g. Ikoyi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
                    <input 
                      type="text" 
                      required 
                      value={hospitalForm.address} 
                      onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Line</label>
                    <input 
                      type="text" 
                      required 
                      value={hospitalForm.phone} 
                      onChange={e => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Google Maps Link</label>
                  <input 
                    type="text" 
                    value={hospitalForm.googleMapsLink} 
                    onChange={e => setHospitalForm({ ...hospitalForm, googleMapsLink: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3"
                  />
                </div>

                {/* Available Specialists checklist */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Equipped Departments:</label>
                  <div className="flex flex-wrap gap-2">
                    {specialists.map(spec => {
                      const isChecked = hospitalForm.availableSpecialistIds.includes(spec.id);
                      return (
                        <div 
                          key={spec.id}
                          onClick={() => toggleHospitalSpecialist(spec.id)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer select-none transition-colors ${
                            isChecked 
                              ? 'bg-purple-600 text-white border-purple-700' 
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {spec.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* THERAPY GUIDES FORM */}
            {activeTab === 'therapy' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Condition Name</label>
                  <input 
                    type="text" 
                    required 
                    value={therapyForm.condition} 
                    onChange={e => setTherapyForm({ ...therapyForm, condition: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    placeholder="e.g. Migraine Headache"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Basic Self-Care Advice (line separated)</label>
                  <textarea 
                    required 
                    rows={4}
                    value={therapyForm.basicAdviceRaw} 
                    onChange={e => setTherapyForm({ ...therapyForm, basicAdviceRaw: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 font-semibold"
                    placeholder="Rest in dark room&#10;Hydrate with cool water&#10;Inhale deeply"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Consult Clinic If Warning Signs</label>
                  <input 
                    type="text" 
                    required 
                    value={therapyForm.seeDocIf} 
                    onChange={e => setTherapyForm({ ...therapyForm, seeDocIf: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    placeholder="Pain persists longer than 3 consecutive days..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Emergency Danger Flags</label>
                  <input 
                    type="text" 
                    value={therapyForm.emergencyFlags} 
                    onChange={e => setTherapyForm({ ...therapyForm, emergencyFlags: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    placeholder="Thunderclap headache onset, loss of speech..."
                  />
                </div>
              </div>
            )}

            {/* RULES MAPPER FORM */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Disease Mapped</label>
                    <select
                      value={ruleForm.diseaseId}
                      onChange={e => setRuleForm({ ...ruleForm, diseaseId: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    >
                      {diseases.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Specialist Recommended</label>
                    <select
                      value={ruleForm.specialistId}
                      onChange={e => setRuleForm({ ...ruleForm, specialistId: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    >
                      {specialists.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Confidence Score multiplier (0.1 to 1.0)</label>
                    <input 
                      type="number" 
                      step="0.05" 
                      min="0.1" 
                      max="1" 
                      required 
                      value={ruleForm.confidenceScore} 
                      onChange={e => setRuleForm({ ...ruleForm, confidenceScore: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3"
                    />
                  </div>
                </div>

                {/* Checklist of symptoms to link to this rule */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Map Symptoms to Trigger Rule:</label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(sym => {
                      const isChecked = ruleForm.symptomIds.includes(sym.id);
                      return (
                        <div 
                          key={sym.id}
                          onClick={() => toggleRuleSymptom(sym.id)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer select-none transition-colors ${
                            isChecked 
                              ? 'bg-purple-600 text-white border-purple-700' 
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {sym.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Form actions */}
            <div className="pt-4 flex justify-end gap-3 border-t border-purple-200/60">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all"
              >
                Commit Changes
              </button>
            </div>

          </form>
        </div>
      )}

      {/* CREATE RESOURCE CTA BUTTON */}
      {!isFormOpen && activeTab !== 'appointments' && (
        <div className="flex justify-end">
          <button 
            onClick={openCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3 px-6 rounded-2xl flex items-center gap-1.5 shadow-md hover:shadow-purple-100 transition-all"
            id="btn-create-resource"
          >
            <Plus className="w-4 h-4 text-purple-200" />
            <span>Add New {activeTab.slice(0, -1)} Record</span>
          </button>
        </div>
      )}

      {/* RENDER DATA TABLE ACCORDING TO TABS */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Symptoms List table */}
        {activeTab === 'symptoms' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Symptom</th>
                  <th className="p-4">Category Category</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {symptoms.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{s.name}</td>
                    <td className="p-4">{s.category}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit('symptoms', s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete('symptoms', s.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Diseases List table */}
        {activeTab === 'diseases' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Disease Condition</th>
                  <th className="p-4">Urgency Level</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {diseases.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{d.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        d.urgencyLevel === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' : d.urgencyLevel === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>{d.urgencyLevel}</span>
                    </td>
                    <td className="p-4 truncate max-w-xs">{d.description}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit('diseases', d)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete('diseases', d.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Specialists List table */}
        {activeTab === 'specialists' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Title Specialist</th>
                  <th className="p-4">Treated Tag Preview</th>
                  <th className="p-4">Scope Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {specialists.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{s.title}</td>
                    <td className="p-4 truncate max-w-[140px]">{s.conditionsTreated.join(', ')}</td>
                    <td className="p-4 truncate max-w-xs">{s.description}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit('specialists', s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete('specialists', s.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Hospitals List table */}
        {activeTab === 'hospitals' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Hospital Name</th>
                  <th className="p-4">State / City</th>
                  <th className="p-4">Phone Contact</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {hospitals.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{h.name}</td>
                    <td className="p-4">{h.state} / {h.city}</td>
                    <td className="p-4">{h.phone}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit('hospitals', h)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete('hospitals', h.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Therapy Guides table */}
        {activeTab === 'therapy' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Condition</th>
                  <th className="p-4">Advice bullet list</th>
                  <th className="p-4">Warning Indicators</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {therapyGuides.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{t.condition}</td>
                    <td className="p-4 truncate max-w-[140px]">{t.basicAdvice.join(' | ')}</td>
                    <td className="p-4 truncate max-w-xs">{t.seeDocIf}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEdit('therapy', t)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete('therapy', t.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Diagnostic Rules mapping table */}
        {activeTab === 'rules' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">ID Rule</th>
                  <th className="p-4">Disease Result</th>
                  <th className="p-4">Specialist Routing</th>
                  <th className="p-4">Trigger Symptoms</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 font-mono text-xs">
                {rules.map(r => {
                  const diseaseObj = diseases.find(d => d.id === r.diseaseId);
                  const specialistObj = specialists.find(s => s.id === r.specialistId);
                  
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-slate-400">{r.id}</td>
                      <td className="p-4 font-extrabold text-slate-950 font-sans">{diseaseObj ? diseaseObj.name : r.diseaseId}</td>
                      <td className="p-4 font-sans font-semibold">{specialistObj ? specialistObj.title : r.specialistId}</td>
                      <td className="p-4 font-sans text-xs max-w-[200px] truncate">
                        {r.symptomIds.map(symId => {
                          const sym = symptoms.find(s => s.id === symId);
                          return sym ? sym.name : symId;
                        }).join(', ')}
                      </td>
                      <td className="p-4 text-purple-700 font-extrabold">{r.confidenceScore}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEdit('rules', r)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete('rules', r.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments List Table */}
        {activeTab === 'appointments' && (
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase border-b border-slate-100">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Patient Info</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Specialist Needed</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                      No appointment reservations filed by patients yet.
                    </td>
                  </tr>
                ) : (
                  appointments.map(appt => {
                    const specObj = specialists.find(s => s.id === appt.specialistId);
                    return (
                      <tr key={appt.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{appt.id}</td>
                        <td className="p-4 space-y-0.5">
                          <p className="font-extrabold text-slate-900">{appt.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{appt.patientEmail}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{appt.patientPhone}</p>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <p className="font-bold text-purple-700">{appt.appointmentDate}</p>
                          <p className="text-[10px] text-slate-500">{appt.appointmentTime}</p>
                        </td>
                        <td className="p-4 text-slate-950">
                          {specObj ? specObj.title : appt.specialistId}
                          {appt.reason && (
                            <p className="text-[11px] text-slate-400 italic max-w-xs truncate" title={appt.reason}>
                              "{appt.reason}"
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${
                            appt.status === 'confirmed' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : appt.status === 'cancelled' 
                                ? 'bg-rose-50 text-rose-600 border-rose-200' 
                                : appt.status === 'completed'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-y-1.5 sm:space-y-0 sm:space-x-1">
                          {appt.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateAppointmentStatus(appt.id, 'confirmed')} 
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-3xs transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status === 'confirmed' && (
                            <button 
                              onClick={() => handleUpdateAppointmentStatus(appt.id, 'completed')} 
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-3xs transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                            <button 
                              onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelled')} 
                              className="bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-250 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAppointment(appt.id)} 
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors inline-flex"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
