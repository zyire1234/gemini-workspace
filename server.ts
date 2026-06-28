import express from 'express';
import { createServer as createViteServer } from 'vite';
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
  adminPasswordHash: string; // Simple check for demo purposes
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
  adminPasswordHash: 'maryam123', // default admin password set to maryam123
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

const app = express();
app.use(express.json());

// Initialize Gemini Client safely using system instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to decode lightweight auth tokens
function getUserFromToken(token: string) {
  try {
    if (!token) return null;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');
    return { userId, email };
  } catch (e) {
    return null;
  }
}

// Middleware to authorize logged-in users
async function optionalUserAuth(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const sessionInfo = getUserFromToken(token);
      if (sessionInfo) {
        const user = await dbFindUserByEmail(sessionInfo.email);
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (e) {
    console.error("Auth middleware error:", e);
  }
  next();
}

// ==================== PREMIUM USER AUTHENTICATION API ====================

// POST Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password, avatar, designation, bio } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Please enter a valid email, username, and password." });
    }

    const existing = await dbFindUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Simple hash for password storage (Base64 encoding + salt is safe for non-crypto project environments)
    const passwordHash = Buffer.from(`${password}_medexpert`).toString('base64');
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const newUser = {
      id: userId,
      email: email.toLowerCase().trim(),
      username,
      avatar: avatar || '👤',
      designation: designation || 'Patient',
      bio: bio || '',
      createdAt: new Date().toISOString()
    };

    await dbCreateUser({
      ...newUser,
      passwordHash
    });

    const token = Buffer.from(`${userId}:${email}`).toString('base64');
    res.status(201).json({ token, user: newUser });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({ error: "Failed to register user. Please try again." });
  }
});

// POST Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    const userRecord = await dbFindUserByEmail(email);
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const expectedHash = Buffer.from(`${password}_medexpert`).toString('base64');
    if (userRecord.passwordHash !== expectedHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Strip passwordHash before sending to client
    const { passwordHash, ...cleanUser } = userRecord;

    const token = Buffer.from(`${userRecord.id}:${userRecord.email}`).toString('base64');
    res.json({ token, user: cleanUser });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET Current User (Me)
app.get('/api/auth/me', optionalUserAuth, (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized session." });
  }
  res.json({ user: req.user });
});


// ==================== PREMIUM CLINICAL AI CHAT API ====================

// POST AI Chat message (integrated with Gemini 3.5-flash)
app.post('/api/ai/chat', optionalUserAuth, async (req: any, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Format optional chatHistory into Gemini conversational blocks
    const formattedHistory = (chatHistory || []).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    // Setup clinical expertise instruction
    const systemInstruction = `
You are MedExpert AI, a premium clinical decision assistant developed by Maryam as a Computer Scientist's final year project at MedExpert.
Your personality is highly professional, clean, comforting, and authoritative. 

CRITICAL DIRECTIVES:
1. Address Nigerian and global healthcare context where helpful, but remain universally applicable.
2. Provide high-quality clinical reasoning, outlining possible differential indications based on user-described symptoms.
3. Suggest appropriate medical specialists to consult (e.g., Cardiologist, Neurologist, Pulmonologist, Gastroenterologist, Pediatrician).
4. Outline basic, actionable self-care or first-aid guidelines.
5. Emphasize that your insights do not replace a face-to-face physician consultation, and recommend seeking in-person medical care promptly.
6. Keep your answers beautifully structured with Markdown, utilizing clean headers, bullet points, and elegant lists. No excessive jargon, but clear professional explanations.
7. Mention Maryam's rules-based booking algorithm if they require scheduling an expert consultation.
`;

    const apiResponse = await ai.models.generateContent({
     model: "gemini-1.5-flash",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = apiResponse.text || "I apologize, but I could not process that medical prompt. Please consult a physical health specialist.";
    res.json({ text: replyText });
  } catch (err: any) {
    console.error("Gemini AI Chat error:", err);
    res.status(500).json({ 
      error: "AI service is temporarily offline or key not configured. Please use our diagnostic symptoms tool or booking board.",
      details: err.message 
    });
  }
});


// Initialize DB once on start
let db = readDatabase();

// --- WebSocket connection registry & broadcast helper ---
const wsClients = new Set<any>();

function broadcastMessage(message: PeerMessage) {
  const payload = JSON.stringify({ type: 'message', data: message });
  for (const client of wsClients) {
    if (client.readyState === 1 /* WebSocket.OPEN */) {
      try {
        client.send(payload);
      } catch (err) {
        console.error("Failed to send WS broadcast:", err);
      }
    }
  }
}

// ==================== PEER COMMUNITY BOARD ENDPOINTS ====================

// GET community messages
app.get('/api/community/messages', async (req, res) => {
  try {
    const messages = await dbGetMessages();
    res.json(messages || []);
  } catch (e) {
    console.error("Failed to get community messages:", e);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

// POST new community message
app.post('/api/community/messages', async (req, res) => {
  try {
    const { senderName, senderAvatar, text, channel } = req.body;
    if (!senderName || !text || !channel) {
      return res.status(400).json({ error: "Missing required fields: senderName, text, or channel" });
    }
    const newMessage: PeerMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      senderName,
      senderAvatar: senderAvatar || '👤',
      text,
      channel,
      timestamp: new Date().toISOString()
    };
    
    await dbCreateMessage(newMessage);

    // Broadcast to live connected WS clients
    broadcastMessage(newMessage);

    res.status(201).json(newMessage);
  } catch (e) {
    console.error("Failed to post community message:", e);
    res.status(500).json({ error: "Failed to post message" });
  }
});


  // ==================== CORE USER API ENDPOINTS ====================

  // Submit symptoms & get diagnosed conditions + specialist recommendation
  app.post('/api/analyze', (req, res) => {
    try {
      db = readDatabase();
      const { symptomIds } = req.body;
      if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
        return res.status(400).json({ error: "Symptom IDs are required as a non-empty array" });
      }

      const results: AnalysisResult[] = [];

      // Calculate rule matches
      db.rules.forEach(rule => {
        const ruleSymptoms = rule.symptomIds || [];
        if (ruleSymptoms.length === 0) return;

        // Find intersection
        const intersection = ruleSymptoms.filter(symId => symptomIds.includes(symId));
        const matchCount = intersection.length;

        if (matchCount > 0) {
          const overlapScore = matchCount / ruleSymptoms.length;
          const finalScore = overlapScore * rule.confidenceScore;

          // Find associated disease & specialist
          const disease = db.diseases.find(d => d.id === rule.diseaseId);
          const specialist = db.specialists.find(s => s.id === rule.specialistId);

          if (disease && specialist) {
            // Find corresponding therapy advice
            const therapyAdvice = db.therapyGuides.find(tg => 
              tg.condition.toLowerCase() === disease.name.toLowerCase()
            ) || null;

            // Check if disease already exists in results, keep highest score
            const existingIdx = results.findIndex(r => r.disease.id === disease.id);
            const resultEntry: AnalysisResult = {
              disease,
              specialist,
              urgencyLevel: disease.urgencyLevel,
              therapyAdvice,
              matchScore: Math.round(finalScore * 100)
            };

            if (existingIdx >= 0) {
              if (results[existingIdx].matchScore < resultEntry.matchScore) {
                results[existingIdx] = resultEntry;
              }
            } else {
              results.push(resultEntry);
            }
          }
        }
      });

      // Sort by match score descending
      results.sort((a, b) => b.matchScore - a.matchScore);

      // Return top 3 matches
      return res.json({ results: results.slice(0, 3) });
    } catch (error: any) {
      console.error("Symptom Analysis Error:", error);
      return res.status(500).json({ error: error.message || "An error occurred during rule analysis" });
    }
  });

  // Get symptoms
  app.get('/api/symptoms', (req, res) => {
    db = readDatabase();
    res.json(db.symptoms);
  });

  // Get specialists
  app.get('/api/specialists', (req, res) => {
    db = readDatabase();
    res.json(db.specialists);
  });

  // Get single specialist
  app.get('/api/specialists/:id', (req, res) => {
    db = readDatabase();
    const specialist = db.specialists.find(s => s.id === req.params.id);
    if (!specialist) return res.status(404).json({ error: "Specialist not found" });
    res.json(specialist);
  });

  // Get hospitals with optional query filtering
  app.get('/api/hospitals', (req, res) => {
    db = readDatabase();
    const { specialist, state, city } = req.query;

    let filtered = [...db.hospitals];

    if (state) {
      filtered = filtered.filter(h => h.state.toLowerCase() === (state as string).toLowerCase());
    }
    if (city) {
      filtered = filtered.filter(h => h.city.toLowerCase().includes((city as string).toLowerCase()));
    }
    if (specialist) {
      filtered = filtered.filter(h => h.availableSpecialists.includes(specialist as string));
    }

    res.json(filtered);
  });

  // Get therapy guide by condition / disease name
  app.get('/api/therapy/:condition', (req, res) => {
    db = readDatabase();
    const conditionParam = req.params.condition.toLowerCase();
    const guide = db.therapyGuides.find(tg => tg.condition.toLowerCase() === conditionParam);
    if (!guide) return res.status(404).json({ error: "No therapy guide found for this condition" });
    res.json(guide);
  });

  // Create appointment booking
  app.post('/api/appointments', (req, res) => {
    try {
      db = readDatabase();
      const { patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, specialistId, reason } = req.body;
      
      if (!patientName || !patientEmail || !patientPhone || !appointmentDate || !appointmentTime || !specialistId) {
        return res.status(400).json({ error: "All booking fields are required" });
      }

      const newAppt: Appointment = {
        id: `appt_${Date.now()}`,
        patientName,
        patientEmail,
        patientPhone,
        appointmentDate,
        appointmentTime,
        specialistId,
        reason: reason || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      db.appointments = db.appointments || [];
      db.appointments.push(newAppt);
      writeDatabase(db);

      // SIMULATE AUTOMATIC EMAIL NOTIFICATION (as requested for SMTP/Notification simulation)
      console.log(`\n=================== SIMULATED SMTP EMAIL NOTIFICATION ===================`);
      console.log(`From: notification@medexpert.com.ng`);
      console.log(`To: ${patientEmail}, Workwithmyrie@gmail.com`);
      console.log(`Subject: MedExpert Appointment Booking Confirmation [${newAppt.id}]`);
      console.log(`Content:`);
      console.log(`Hello ${patientName},`);
      console.log(`Your medical specialist consult reservation has been registered successfully.`);
      console.log(`Details:`);
      console.log(`- Appointment Ref: ${newAppt.id}`);
      console.log(`- Specialist Code: ${specialistId}`);
      console.log(`- Preferred Date: ${appointmentDate}`);
      console.log(`- Preferred Time: ${appointmentTime}`);
      console.log(`- Reason for Visit: ${reason || 'Not specified'}`);
      console.log(`\nMaryam (Admin Office) has been notified at Workwithmyrie@gmail.com.`);
      console.log(`=========================================================================\n`);

      return res.status(201).json(newAppt);
    } catch (error: any) {
      console.error("Booking Error:", error);
      return res.status(500).json({ error: error.message || "Failed to save booking" });
    }
  });


  // ==================== ADMIN ACTIONS & AUTH ====================

  // Admin login
  app.post('/api/admin/auth/login', (req, res) => {
    db = readDatabase();
    const { email, password } = req.body;
    // Accept either admin@purplevision.com or Maryam
    if ((email === 'admin@purplevision.com' || email === 'Maryam' || email === 'maryam@medexpert.com') && password === db.adminPasswordHash) {
      // Return mock JWT success response
      return res.json({ token: "purple-vision-secure-admin-token-2026", user: { email, role: "admin" } });
    }
    return res.status(401).json({ error: "Invalid admin credentials. Use Maryam or admin@purplevision.com with correct password." });
  });

  // Simple token validator middleware
  const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === "Bearer purple-vision-secure-admin-token-2026") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access. Admin privileges required." });
    }
  };

  // --- ADMIN GET ALL APPOINTMENTS ---
  app.get('/api/admin/appointments', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.appointments || []);
  });

  // --- ADMIN UPDATE APPOINTMENT STATUS ---
  app.put('/api/admin/appointments/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.appointments.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Appointment not found" });
    db.appointments[idx] = { ...db.appointments[idx], ...req.body };
    writeDatabase(db);
    res.json(db.appointments[idx]);
  });

  // --- ADMIN DELETE APPOINTMENT ---
  app.delete('/api/admin/appointments/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.appointments = db.appointments.filter(a => a.id !== req.params.id);
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR SYMPTOMS ---
  app.get('/api/admin/symptoms', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.symptoms);
  });

  app.post('/api/admin/symptoms', adminAuth, (req, res) => {
    db = readDatabase();
    const { name, category } = req.body;
    const newSym: Symptom = {
      id: `sym_${Date.now()}`,
      name,
      category
    };
    db.symptoms.push(newSym);
    writeDatabase(db);
    res.status(201).json(newSym);
  });

  app.put('/api/admin/symptoms/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.symptoms.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Symptom not found" });
    db.symptoms[idx] = { ...db.symptoms[idx], ...req.body };
    writeDatabase(db);
    res.json(db.symptoms[idx]);
  });

  app.delete('/api/admin/symptoms/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.symptoms = db.symptoms.filter(s => s.id !== req.params.id);
    // Also remove from rules
    db.rules = db.rules.map(r => ({
      ...r,
      symptomIds: r.symptomIds.filter(id => id !== req.params.id)
    }));
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR DISEASES ---
  app.get('/api/admin/diseases', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.diseases);
  });

  app.post('/api/admin/diseases', adminAuth, (req, res) => {
    db = readDatabase();
    const { name, description, urgencyLevel } = req.body;
    const newDis: Disease = {
      id: `dis_${Date.now()}`,
      name,
      description,
      urgencyLevel
    };
    db.diseases.push(newDis);
    writeDatabase(db);
    res.status(201).json(newDis);
  });

  app.put('/api/admin/diseases/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.diseases.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Disease not found" });
    db.diseases[idx] = { ...db.diseases[idx], ...req.body };
    writeDatabase(db);
    res.json(db.diseases[idx]);
  });

  app.delete('/api/admin/diseases/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.diseases = db.diseases.filter(d => d.id !== req.params.id);
    // Also delete associated rules and therapy guides
    db.rules = db.rules.filter(r => r.diseaseId !== req.params.id);
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR SPECIALISTS ---
  app.get('/api/admin/specialists', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.specialists);
  });

  app.post('/api/admin/specialists', adminAuth, (req, res) => {
    db = readDatabase();
    const { title, description, conditionsTreated } = req.body;
    const newSpec: Specialist = {
      id: `spec_${Date.now()}`,
      title,
      description,
      conditionsTreated: Array.isArray(conditionsTreated) ? conditionsTreated : []
    };
    db.specialists.push(newSpec);
    writeDatabase(db);
    res.status(201).json(newSpec);
  });

  app.put('/api/admin/specialists/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.specialists.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Specialist not found" });
    db.specialists[idx] = { ...db.specialists[idx], ...req.body };
    writeDatabase(db);
    res.json(db.specialists[idx]);
  });

  app.delete('/api/admin/specialists/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.specialists = db.specialists.filter(s => s.id !== req.params.id);
    // Remove from rules & hospital links
    db.rules = db.rules.filter(r => r.specialistId !== req.params.id);
    db.hospitals = db.hospitals.map(h => ({
      ...h,
      availableSpecialists: h.availableSpecialists.filter(id => id !== req.params.id)
    }));
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR HOSPITALS ---
  app.get('/api/admin/hospitals', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.hospitals);
  });

  app.post('/api/admin/hospitals', adminAuth, (req, res) => {
    db = readDatabase();
    const { name, state, city, address, phone, googleMapsLink, availableSpecialists } = req.body;
    const newHosp: Hospital = {
      id: `hosp_${Date.now()}`,
      name,
      state,
      city,
      address,
      phone,
      googleMapsLink: googleMapsLink || '',
      availableSpecialists: Array.isArray(availableSpecialists) ? availableSpecialists : []
    };
    db.hospitals.push(newHosp);
    writeDatabase(db);
  res.status(201).json(newHosp);
  });

  app.put('/api/admin/hospitals/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.hospitals.findIndex(h => h.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Hospital not found" });
    db.hospitals[idx] = { ...db.hospitals[idx], ...req.body };
    writeDatabase(db);
    res.json(db.hospitals[idx]);
  });

  app.delete('/api/admin/hospitals/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.hospitals = db.hospitals.filter(h => h.id !== req.params.id);
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR THERAPY GUIDES ---
  app.get('/api/admin/therapy', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.therapyGuides);
  });

  app.post('/api/admin/therapy', adminAuth, (req, res) => {
    db = readDatabase();
    const { condition, basicAdvice, seeDocIf, emergencyFlags } = req.body;
    const newGuide: TherapyGuide = {
      id: `tg_${Date.now()}`,
      condition,
      basicAdvice: Array.isArray(basicAdvice) ? basicAdvice : [],
      seeDocIf: seeDocIf || '',
      emergencyFlags: emergencyFlags || ''
    };
    db.therapyGuides.push(newGuide);
    writeDatabase(db);
 res.status(201).json(newGuide);
  });

  app.put('/api/admin/therapy/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.therapyGuides.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Therapy guide not found" });
    db.therapyGuides[idx] = { ...db.therapyGuides[idx], ...req.body };
    writeDatabase(db);
    res.json(db.therapyGuides[idx]);
  });

  app.delete('/api/admin/therapy/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.therapyGuides = db.therapyGuides.filter(t => t.id !== req.params.id);
    writeDatabase(db);
    res.json({ success: true });
  });

  // --- ADMIN CRUD FOR RULES ---
  app.get('/api/admin/rules', adminAuth, (req, res) => {
    db = readDatabase();
    res.json(db.rules);
  });

  app.post('/api/admin/rules', adminAuth, (req, res) => {
    db = readDatabase();
    const { symptomIds, diseaseId, specialistId, confidenceScore } = req.body;
    const newRule: Rule = {
      id: `rule_${Date.now()}`,
      symptomIds: Array.isArray(symptomIds) ? symptomIds : [],
      diseaseId,
      specialistId,
      confidenceScore: typeof confidenceScore === 'number' ? confidenceScore : 0.8
    };
    db.rules.push(newRule);
    writeDatabase(db);
   res.status(201).json(newRule);
  });

  app.put('/api/admin/rules/:id', adminAuth, (req, res) => {
    db = readDatabase();
    const idx = db.rules.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Rule not found" });
    db.rules[idx] = { ...db.rules[idx], ...req.body };
    writeDatabase(db);
    res.json(db.rules[idx]);
  });

  app.delete('/api/admin/rules/:id', adminAuth, (req, res) => {
    db = readDatabase();
    db.rules = db.rules.filter(r => r.id !== req.params.id);
    writeDatabase(db);
    res.json({ success: true });
  });


  // ==================== VITE MIDDLEWARE SETUP ====================

async function setupViteAndListen() {
  await initDatabase();
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

const port = process.env.PORT || 3000;
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });

  // Attach real WebSocket server
  const wss = new WebSocketServer({ server });
  wss.on('connection', async (ws: any) => {
    wsClients.add(ws);

    try {
      // Send latest messages on initial connection
      const messages = await dbGetMessages();
      ws.send(JSON.stringify({ type: 'init', data: messages || [] }));
    } catch (err) {
      console.error("Failed to send initial WS messages:", err);
    }

    ws.on('message', async (messageRaw: any) => {
      try {
        const payload = JSON.parse(messageRaw.toString());
        if (payload.type === 'message') {
          const { senderName, senderAvatar, text, channel } = payload.data;
          const newMessage: PeerMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            senderName: senderName || 'Anonymous',
            senderAvatar: senderAvatar || '👤',
            text: text || '',
            channel: channel || 'general',
            timestamp: new Date().toISOString()
          };

          await dbCreateMessage(newMessage);
          broadcastMessage(newMessage);
        }
      } catch (err) {
        console.error("Failed to process WS message:", err);
      }
    });

    ws.on('close', () => {
      wsClients.delete(ws);
    });

    ws.on('error', () => {
      wsClients.delete(ws);
    });
  });
}

if (!process.env.VERCEL) {
  setupViteAndListen().catch((err) => {
    console.error("Server startup failed:", err);
  });
}

export default app;