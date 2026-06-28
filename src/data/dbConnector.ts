import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_SYMPTOMS, 
  INITIAL_DISEASES, 
  INITIAL_SPECIALISTS, 
  INITIAL_HOSPITALS, 
  INITIAL_THERAPY_GUIDES, 
  INITIAL_RULES 
} from './initialData.js';
import { Symptom, Specialist, Disease, Hospital, TherapyGuide, Rule, Appointment, PeerMessage, User } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname);
const DB_FILE = path.join(DB_DIR, 'db.json');

// Interface for local JSON database file
interface JSONDatabase {
  users: (User & { passwordHash: string })[];
  messages: PeerMessage[];
  appointments: Appointment[];
  symptoms: Symptom[];
  diseases: Disease[];
  specialists: Specialist[];
  hospitals: Hospital[];
  therapyGuides: TherapyGuide[];
  rules: Rule[];
}

const DEFAULT_JSON_DB: JSONDatabase = {
  users: [],
  messages: [
    {
      id: 'm1',
      senderName: 'Dr. Kunle',
      senderAvatar: 'MD',
      text: 'Welcome to the peer community board! Here you can ask questions, discuss active symptoms, and support other patients and specialists.',
      channel: 'general',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'm2',
      senderName: 'Amara N.',
      senderAvatar: 'PT',
      text: 'Has anyone visited Lagoon Hospital in Lagos for cardiology consultation? How was your experience?',
      channel: 'cardiology',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'm3',
      senderName: 'Tunde O.',
      senderAvatar: 'PT',
      text: 'Yes, highly recommended. The department at Lagoon Hospital is excellent. Dr. Somto is exceptionally detailed.',
      channel: 'cardiology',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'm4',
      senderName: 'Maryam K.',
      senderAvatar: 'MD',
      text: 'For respiratory symptoms like high fever and short breath, please do not hesitate to contact National Hospital Abuja or use our booking tab.',
      channel: 'respiratory',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  appointments: [],
  symptoms: INITIAL_SYMPTOMS,
  diseases: INITIAL_DISEASES,
  specialists: INITIAL_SPECIALISTS,
  hospitals: INITIAL_HOSPITALS,
  therapyGuides: INITIAL_THERAPY_GUIDES,
  rules: INITIAL_RULES,
};

// Ensure DB Directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Read database from file
function readLocalDB(): JSONDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_JSON_DB, null, 2), 'utf-8');
      return DEFAULT_JSON_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      messages: parsed.messages || DEFAULT_JSON_DB.messages,
      appointments: parsed.appointments || [],
      symptoms: parsed.symptoms || INITIAL_SYMPTOMS,
      diseases: parsed.diseases || INITIAL_DISEASES,
      specialists: parsed.specialists || INITIAL_SPECIALISTS,
      hospitals: parsed.hospitals || INITIAL_HOSPITALS,
      therapyGuides: parsed.therapyGuides || INITIAL_THERAPY_GUIDES,
      rules: parsed.rules || INITIAL_RULES,
    };
  } catch (e) {
    console.error("Failed to read local JSON database, returning defaults:", e);
    return DEFAULT_JSON_DB;
  }
}

// Write database to file
function writeLocalDB(data: JSONDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to save local JSON database:", e);
  }
}

// -------------------------------------------------------------------------
// MONGOOSE SCHEMAS AND CONFIGS
// -------------------------------------------------------------------------
let isMongoConnected = false;

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String, default: 'PT' },
  designation: { type: String, default: 'Patient' },
  bio: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PeerMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: 'PT' },
  text: { type: String, required: true },
  channel: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AppointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  specialistId: { type: String, required: true },
  reason: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

let UserModel: any;
let PeerMessageModel: any;
let AppointmentModel: any;

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log("Attempting connection to MongoDB...");
      await mongoose.connect(mongoUri);
      isMongoConnected = true;
      console.log("🎉 Successfully connected to real MongoDB database!");

      UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
      PeerMessageModel = mongoose.models.PeerMessage || mongoose.model('PeerMessage', PeerMessageSchema);
      AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
    } catch (e) {
      console.error("❌ Failed to connect to MongoDB. Falling back to local filesystem store.", e);
      isMongoConnected = false;
    }
  } else {
    console.log("⚠️ No MONGODB_URI found in environment. Utilizing premium local filesystem storage.");
    isMongoConnected = false;
  }
}

// -------------------------------------------------------------------------
// DATABASE OPERATIONS WRAPPERS (FALLBACK-AWARE)
// -------------------------------------------------------------------------

// --- USER OPERATIONS ---
export async function dbFindUserByEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim();
  if (isMongoConnected) {
    try {
      const user = await UserModel.findOne({ email: cleanEmail }).lean();
      return user;
    } catch (e) {
      console.error("Mongoose findUser error:", e);
    }
  }
  
  // Local JSON fallback
  const local = readLocalDB();
  const found = local.users.find(u => u.email.toLowerCase().trim() === cleanEmail);
  return found || null;
}

export async function dbCreateUser(userData: User & { passwordHash: string }) {
  userData.email = userData.email.toLowerCase().trim();
  if (isMongoConnected) {
    try {
      const newDoc = new UserModel(userData);
      await newDoc.save();
      return userData;
    } catch (e) {
      console.error("Mongoose createUser error:", e);
    }
  }

  // Local JSON fallback
  const local = readLocalDB();
  local.users.push(userData);
  writeLocalDB(local);
  return userData;
}

// --- PEER MESSAGES OPERATIONS ---
export async function dbGetMessages(): Promise<PeerMessage[]> {
  if (isMongoConnected) {
    try {
      const list = await PeerMessageModel.find({}).sort({ timestamp: 1 }).limit(150).lean();
      return list.map((m: any) => ({
        id: m.id,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        text: m.text,
        channel: m.channel,
        timestamp: m.timestamp.toISOString()
      }));
    } catch (e) {
      console.error("Mongoose getMessages error:", e);
    }
  }

  // Local JSON fallback
  const local = readLocalDB();
  return local.messages;
}

export async function dbCreateMessage(msg: PeerMessage): Promise<PeerMessage> {
  if (isMongoConnected) {
    try {
      const newDoc = new PeerMessageModel({
        id: msg.id,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        text: msg.text,
        channel: msg.channel,
        timestamp: new Date(msg.timestamp)
      });
      await newDoc.save();
      return msg;
    } catch (e) {
      console.error("Mongoose createMessage error:", e);
    }
  }

  // Local JSON fallback
  const local = readLocalDB();
  local.messages.push(msg);
  if (local.messages.length > 150) {
    local.messages = local.messages.slice(-150);
  }
  writeLocalDB(local);
  return msg;
}

// --- APPOINTMENT OPERATIONS ---
export async function dbGetAppointments(): Promise<Appointment[]> {
  if (isMongoConnected) {
    try {
      const list = await AppointmentModel.find({}).sort({ createdAt: -1 }).lean();
      return list.map((a: any) => ({
        id: a.id,
        patientName: a.patientName,
        patientEmail: a.patientEmail,
        patientPhone: a.patientPhone,
        appointmentDate: a.appointmentDate,
        appointmentTime: a.appointmentTime,
        specialistId: a.specialistId,
        reason: a.reason,
        status: a.status,
        createdAt: a.createdAt.toISOString()
      }));
    } catch (e) {
      console.error("Mongoose getAppointments error:", e);
    }
  }

  // Local JSON fallback
  const local = readLocalDB();
  return local.appointments;
}

export async function dbCreateAppointment(app: Appointment): Promise<Appointment> {
  if (isMongoConnected) {
    try {
      const newDoc = new AppointmentModel({
        id: app.id,
        patientName: app.patientName,
        patientEmail: app.patientEmail,
        patientPhone: app.patientPhone,
        appointmentDate: app.appointmentDate,
        appointmentTime: app.appointmentTime,
        specialistId: app.specialistId,
        reason: app.reason,
        status: app.status,
        createdAt: new Date(app.createdAt)
      });
      await newDoc.save();
      return app;
    } catch (e) {
      console.error("Mongoose createAppointment error:", e);
    }
  }

  // Local JSON fallback
  const local = readLocalDB();
  local.appointments.unshift(app);
  writeLocalDB(local);
  return app;
}
