import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  initDatabase, 
  dbFindUserByEmail, 
  dbCreateUser, 
  dbGetMessages, 
  dbCreateMessage, 
  dbGetAppointments, 
  dbCreateAppointment 
} from './src/data/dbConnector.js';

import { 
  INITIAL_SYMPTOMS, 
  INITIAL_DISEASES, 
  INITIAL_SPECIALISTS, 
  INITIAL_HOSPITALS, 
  INITIAL_THERAPY_GUIDES, 
  INITIAL_RULES 
} from './src/data/initialData.js';

import { Symptom, Specialist, Disease, Hospital, TherapyGuide, Rule, AnalysisResult, Appointment, PeerMessage } from './src/types.js';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure db directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const INITIAL_PEER_MESSAGES: PeerMessage[] = [
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
];

interface Database {
  symptoms: Symptom[];
  diseases: Disease[];
  specialists: Specialist[];
  hospitals: Hospital[];
  therapyGuides: TherapyGuide[];
  rules: Rule[];
  adminPasswordHash: string;
  appointments: Appointment[];
  messages: PeerMessage[];
}

const DEFAULT_DB: Database = {
  symptoms: INITIAL_SYMPTOMS,
  diseases: INITIAL_DISEASES,
  specialists: INITIAL_SPECIALISTS,
  hospitals: INITIAL_HOSPITALS,
  therapyGuides: INITIAL_THERAPY_GUIDES,
  rules: INITIAL_RULES,
  adminPasswordHash: 'maryam123',
  appointments: [],
  messages: INITIAL_PEER_MESSAGES
};

function readDatabase(): Database {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(raw);
    // Ensure all keys exist
    return {
      symptoms: db.symptoms || INITIAL_SYMPTOMS,
      diseases: db.diseases || INITIAL_DISEASES,
      specialists: db.specialists || INITIAL_SPECIALISTS,
      hospitals: db.hospitals || INITIAL_HOSPITALS,
      therapyGuides: db.therapyGuides || INITIAL_THERAPY_GUIDES,
      rules: db.rules || INITIAL_RULES,
      adminPasswordHash: db.adminPasswordHash || 'maryam123',
      appointments: db.appointments || [],
      messages: db.messages || INITIAL_PEER_MESSAGES
    };
  } catch (error) {
    console.error("Failed to read database file, reverting to default data:", error);
    return DEFAULT_DB;
  }
}

function writeDatabase(data: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

// TODO: Add the rest of your Express app, routes, WebSocket, and server.listen() code below this line
// const app = express();
// ...