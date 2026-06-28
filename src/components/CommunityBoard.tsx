import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Check, 
  Search, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ShieldAlert, 
  LogOut, 
  Globe, 
  Activity, 
  ChevronRight,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { PeerMessage, User as UserType } from '../types';

const CHANNELS = [
  { id: 'general', name: 'General Peer Support', desc: 'Discuss general wellness questions with other patients.' },
  { id: 'cardiology', name: 'Cardiology Board', desc: 'Heart health, pulse checks, and cardiologist reviews.' },
  { id: 'respiratory', name: 'Lung & Respiratory', desc: 'Pneumonia, asthma, cough, and chest queries.' },
  { id: 'digestive', name: 'Digestive & Gastric', desc: 'Gastritis, ulcer, nutrition advice, and gastroenterology.' },
  { id: 'neurology', name: 'Brain & Headaches', desc: 'Migraine, stress management, and neurologist routing.' },
  { id: 'general_wellness', name: 'Wellness & Prevention', desc: 'General fitness, healthy living tips, and advice.' }
];

const AVATARS = ['PT', 'MS', 'HA', 'MD', 'RN', 'GP'];

interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function CommunityBoard() {
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [newMessageText, setNewMessageText] = useState('');
  
  // Chat modes: 'peer' (peer-to-peer boards) or 'ai' (MedExpert Clinical AI)
  const [chatMode, setChatMode] = useState<'peer' | 'ai'>('peer');

  // AI Chat History State
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: 'ai-welcome',
      sender: 'ai',
      text: "Hello! I am MedExpert AI, your advanced clinical decision assistant. Describe any symptoms or concerns, and I will provide detailed diagnostic conditions, specialist referrals, and first-aid guidance. \n\n*Note: My recommendations do not replace an in-person physical physician consultation.*",
      timestamp: new Date().toISOString()
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Form Inputs
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('PT');
  const [selectedDesignation, setSelectedDesignation] = useState<'Patient' | 'Medical Student' | 'Healthcare Ally' | 'Specialist'>('Patient');
  const [bioInput, setBioInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Load user session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('med_token');
    const savedUser = localStorage.getItem('med_user');
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('med_token');
        localStorage.removeItem('med_user');
      }
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel, chatMode]);

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, chatMode]);

  // Fetch initial messages and set up connection
  useEffect(() => {
    if (!authToken) return;

    fetchMessages();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    let isClosed = false;

    const connectWebSocket = () => {
      if (isClosed) return;
      
      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'init') {
              setMessages((prev) => {
                const map = new Map<string, PeerMessage>(prev.map(m => [m.id, m]));
                const incoming: PeerMessage[] = payload.data;
                incoming.forEach(m => map.set(m.id, m));
                return Array.from(map.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
              });
            } else if (payload.type === 'message') {
              const newMsg: PeerMessage = payload.data;
              setMessages((prev) => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          } catch (err) {
            console.error("Error reading websocket payload:", err);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.error("WebSocket creation error:", err);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    const pollInterval = setInterval(() => {
      if (!wsConnected) {
        fetchMessages();
      }
    }, 4000);

    return () => {
      isClosed = true;
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [authToken, wsConnected]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/community/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => {
          const map = new Map<string, PeerMessage>(prev.map(m => [m.id, m]));
          const incoming: PeerMessage[] = data;
          incoming.forEach(m => map.set(m.id, m));
          return Array.from(map.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
      }
    } catch (err) {
      console.error("Failed to poll community messages:", err);
    }
  };

  // Auth Submit Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const url = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = authMode === 'signup' ? {
      email: emailInput,
      username: usernameInput,
      password: passwordInput,
      avatar: selectedAvatar === '👤' ? '🩺' : selectedAvatar,
      designation: selectedDesignation,
      bio: bioInput
    } : {
      email: emailInput,
      password: passwordInput
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Save to states and localStorage
      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('med_token', data.token);
      localStorage.setItem('med_user', JSON.stringify(data.user));
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('med_token');
    localStorage.removeItem('med_user');
    setAuthToken(null);
    setCurrentUser(null);
    setEmailInput('');
    setPasswordInput('');
    setUsernameInput('');
    setBioInput('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentUser) return;

    const senderDisplay = currentUser.designation === 'Specialist' 
      ? `Dr. ${currentUser.username}` 
      : currentUser.username;

    const messagePayload = {
      senderName: senderDisplay,
      senderAvatar: currentUser.avatar,
      text: newMessageText.trim(),
      channel: activeChannel
    };

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: PeerMessage = {
      id: tempId,
      senderName: senderDisplay,
      senderAvatar: currentUser.avatar,
      text: newMessageText.trim(),
      channel: activeChannel,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessageText('');

    try {
      const res = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });

      if (res.ok) {
        const actualMessage: PeerMessage = await res.json();
        setMessages(prev => prev.map(m => m.id === tempId ? actualMessage : m));
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        alert("Failed to deliver message. Retrying...");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  // Handle AI clinical helper chat
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInputText.trim() || isAiLoading) return;

    const userPrompt = aiInputText.trim();
    const userMessage: AIChatMessage = {
      id: `ai-usr-${Date.now()}`,
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toISOString()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInputText('');
    setIsAiLoading(true);

    try {
      // Package clean history for Gemini reference
      const chatHistory = aiMessages.map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          prompt: userPrompt,
          chatHistory
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to fetch clinical advice.');
      }

      const aiReply: AIChatMessage = {
        id: `ai-reply-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toISOString()
      };

      setAiMessages(prev => [...prev, aiReply]);
    } catch (err: any) {
      console.error("AI chat error:", err);
      setAiMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Clinical Network Timeout**: ${err.message || 'The Gemini clinical portal is loading. Please confirm your API key is correctly active in the developer Secrets panel.'}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredMessages = messages
    .filter(m => m.channel === activeChannel)
    .filter(m => {
      if (!searchQuery.trim()) return true;
      return m.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
             m.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Custom basic markdown to premium HTML helper for gorgeous AI formatting
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Check Headers
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-extrabold text-slate-900 mt-3 mb-1">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-black text-slate-900 mt-4 mb-2 border-b border-slate-100 pb-1">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={idx} className="text-lg font-black text-slate-900 mt-4 mb-2">{trimmed.replace('#', '').trim()}</h2>;
      }

      // Check bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="list-disc ml-4 text-xs font-medium text-slate-700 leading-relaxed py-0.5">
            {parseBoldText(content)}
          </li>
        );
      }

      // Default paragraph with potential bold matching
      if (trimmed === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-xs font-medium text-slate-700 leading-relaxed mb-2">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-slate-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      
      {/* ------------------------------------------------------------- */}
      {/* AUTHENTICATION OVERLAY */}
      {/* ------------------------------------------------------------- */}
      {!currentUser ? (
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-900 text-white min-h-[500px]">
          <div className="w-full max-w-md bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {authMode === 'signup' ? 'Create Your Health Account' : 'Sign In to MedExpert'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Join our medical peer board and access premium server-side AI consultation logs in Nigeria and globally.
              </p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Screen Username</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. MaryamBello"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Designation</label>
                      <select
                        value={selectedDesignation}
                        onChange={(e) => setSelectedDesignation(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="Patient">Patient</option>
                        <option value="Medical Student">Medical Student</option>
                        <option value="Healthcare Ally">Healthcare Ally</option>
                        <option value="Specialist">Medical Specialist</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Select Avatar</label>
                      <select
                        value={selectedAvatar}
                        onChange={(e) => setSelectedAvatar(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                      >
                        {AVATARS.map(emoji => (
                          <option key={emoji} value={emoji}>{emoji} Avatar</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Professional Bio (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Nursing student at University of Lagos"
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:bg-slate-800 text-white font-black py-3 rounded-xl shadow-lg text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>{authMode === 'signup' ? 'Create Account & Access' : 'Sign In Now'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-900">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold tracking-tight transition-colors"
              >
                {authMode === 'login' ? "Don't have an account? Sign Up free" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* AUTHENTICATED CHAT HUB WORKSPACE */
        /* ------------------------------------------------------------- */
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          
          {/* USER PROFILE RECAP & TOP NAVIGATION TABS */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shadow-md z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-tighter bg-slate-800 text-purple-400 w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700/60 shadow-inner">
                {currentUser.avatar}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">{currentUser.username}</h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-md border border-purple-500/20">
                    {currentUser.designation}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-xs">{currentUser.bio || 'MedExpert Verified Member'}</p>
              </div>
            </div>

            {/* TAB SELECTOR & LOGOUT */}
            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <div className="bg-slate-950 p-1 rounded-xl flex gap-1 border border-slate-800">
                <button
                  onClick={() => setChatMode('peer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    chatMode === 'peer' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Peer Support</span>
                </button>
                <button
                  onClick={() => setChatMode('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    chatMode === 'ai' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden xs:inline">Clinical AI</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                title="Log Out Session"
                className="p-2 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* WORKSPACE MODE: 1. REAL-TIME PEER DISCUSSION */}
          {/* ------------------------------------------------------------- */}
          {chatMode === 'peer' ? (
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              
              {/* CHANNELS CAROUSEL HORIZONTAL BAR */}
              <div className="bg-white border-b border-slate-100 px-3 py-2 shrink-0 flex gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
                {CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      activeChannel === channel.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100'
                    }`}
                  >
                    {channel.name}
                  </button>
                ))}
              </div>

              {/* ACTIVE CHANNEL DETAILS BAR & SEARCH */}
              <div className="bg-slate-50 border-b border-slate-200/40 px-4 py-3 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xs font-extrabold text-slate-800 tracking-tight">
                    {CHANNELS.find(c => c.id === activeChannel)?.name}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {CHANNELS.find(c => c.id === activeChannel)?.desc}
                  </p>
                </div>

                {/* SEARCH INPUT */}
                <div className="relative w-full sm:w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-[10px] font-semibold focus:outline-none focus:border-purple-500 transition-colors shadow-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* PEER MESSAGES STREAM */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/40">
                {filteredMessages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-2">
                    <div className="w-10 h-10 bg-slate-200/50 rounded-xl flex items-center justify-center text-slate-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-700 text-xs">No Messages on this Board</h3>
                    <p className="text-slate-400 text-[10px] font-semibold max-w-xs">
                      {searchQuery.trim() 
                        ? "No messages match your search term. Try checking another channel." 
                        : "Be the first verified user to ask a question or share advice in this channel!"}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isMyMessage = msg.senderName === currentUser.username || msg.senderName === `Dr. ${currentUser.username}`;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-150 shadow-xs flex items-center justify-center text-[10px] font-black text-purple-700 shrink-0 select-none">
                          {msg.senderAvatar}
                        </div>

                        <div className={`max-w-[75%] space-y-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center gap-1.5 justify-start text-[10px] text-slate-400 font-black px-1">
                            <span className={isMyMessage ? 'text-purple-600' : 'text-slate-600'}>
                              {msg.senderName}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div
                            className={`rounded-2xl px-4 py-2 text-xs font-semibold leading-relaxed shadow-xs ${
                              isMyMessage
                                ? 'bg-purple-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* PEER MESSAGE INPUT BAR */}
              <form
                onSubmit={handleSendMessage}
                className="bg-white border-t border-slate-200 p-3 shrink-0 flex items-center gap-2 shadow-inner"
              >
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={`Send medical message to ${CHANNELS.find(c => c.id === activeChannel)?.name}...`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* WORKSPACE MODE: 2. ADVANCED CLINICAL AI CONSULTATION */
            /* ------------------------------------------------------------- */
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              
              {/* CLINICAL PORTAL ACCENT */}
              <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 shrink-0 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>MedExpert AI Consultation Room</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Diagnostic support &amp; custom-grounded clinical analysis
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-purple-100 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-purple-600">
                  <Activity className="w-3 h-3 text-purple-500 animate-pulse" />
                  <span>SECURE SERVER CHANNEL</span>
                </div>
              </div>

              {/* AI MESSAGES CHAT HISTORY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/30">
                {aiMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl shadow-sm flex items-center justify-center text-[10px] font-black shrink-0 border select-none ${
                        isUser 
                          ? 'bg-purple-50 text-purple-700 border-purple-150' 
                          : 'bg-indigo-950 text-white border-indigo-900'
                      }`}>
                        {isUser ? currentUser.avatar : 'AI'}
                      </div>

                      {/* Content Bubble */}
                      <div className={`max-w-[80%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {/* Name Header */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-black px-1 justify-start">
                          <span className={isUser ? 'text-purple-600' : 'text-indigo-900'}>
                            {isUser ? currentUser.username : 'MEDEXPERT CLINICAL AI'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className={`rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none space-y-2'
                        }`}>
                          {isUser ? msg.text : renderFormattedText(msg.text)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading state indicator */}
                {isAiLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-950 text-white border border-indigo-900 shadow-sm flex items-center justify-center text-[10px] font-black shrink-0">
                      AI
                    </div>
                    <div className="max-w-[80%] space-y-1">
                      <div className="text-[10px] text-slate-400 font-black px-1">
                        MEDEXPERT CLINICAL AI is compiling analysis...
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                          <span>Analyzing clinical symptoms...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={aiMessagesEndRef} />
              </div>

              {/* AI INTERACTION FORM */}
              <form
                onSubmit={handleSendAiMessage}
                className="bg-white border-t border-slate-200 p-3 shrink-0 flex items-center gap-2 shadow-inner"
              >
                <input
                  type="text"
                  required
                  maxLength={500}
                  disabled={isAiLoading}
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder="Describe active symptoms, duration, fever presence, etc..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!aiInputText.trim() || isAiLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FOOTER STRICT WARNINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 text-[9px] text-slate-500 text-center shrink-0 flex items-center justify-center gap-1 select-none">
        <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
        <span>MedExpert system designed by Maryam. Verified clinical boards &amp; premium rules-based matchmaking.</span>
      </div>

    </div>
  );
}
