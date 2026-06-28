export interface Symptom {
  id: string;
  name: string;
  category: 'Head & Neurological' | 'Chest & Respiratory' | 'Digestive' | 'Skin' | 'Eyes & Vision' | 'Musculoskeletal' | 'General';
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
}

export interface Specialist {
  id: string;
  title: string;
  description: string;
  conditionsTreated: string[];
}

export interface Hospital {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  googleMapsLink: string;
  availableSpecialists: string[]; // Specialist IDs
}

export interface TherapyGuide {
  id: string;
  condition: string;
  basicAdvice: string[];
  seeDocIf: string;
  emergencyFlags: string;
}

export interface Rule {
  id: string;
  symptomIds: string[];
  diseaseId: string;
  specialistId: string;
  confidenceScore: number; // 0 to 1
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  specialistId: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AnalysisResult {
  disease: Disease;
  specialist: Specialist;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  therapyAdvice: TherapyGuide | null;
  matchScore: number;
}

export interface PeerMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  channel: string; // e.g., 'general', 'cardiology', 'digestive', etc.
  timestamp: string; // ISO string
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  designation: 'Patient' | 'Medical Student' | 'Healthcare Ally' | 'Specialist';
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

