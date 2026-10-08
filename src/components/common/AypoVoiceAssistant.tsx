import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Radio, 
  MapPin, 
  PhoneCall, 
  UserPlus, 
  Home, 
  HeartPulse, 
  Send,
  RefreshCw,
  Compass,
  ArrowRight
} from 'lucide-react';
import { locationService } from '../../services/locationService';

interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: string;
  timestamp: string;
}

interface AypoVoiceAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onReportMissing?: () => void;
  onOpenMap?: () => void;
  onOpenHelplines?: () => void;
  onOpenCentres?: () => void;
  onOpenHospitals?: () => void;
}

export const AypoVoiceAssistant: React.FC<AypoVoiceAssistantProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen,
  onReportMissing,
  onOpenMap,
  onOpenHelplines,
  onOpenCentres,
  onOpenHospitals
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);

  const handleOpen = () => {
    if (controlledOnOpen) controlledOnOpen();
    else setInternalIsOpen(true);
    speakText("AYPO Emergency Assistant ready. How can I assist you?");
  };

  const handleClose = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (controlledOnClose) controlledOnClose();
    else setInternalIsOpen(false);
  };

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'AYPO Emergency AI Assistant online. I can help you report missing loved ones, locate shelters, find open hospital beds, or route you to emergency teams. Speak or type below.',
      timestamp: 'Active Now'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // Main Assistant Recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            handleProcessCommand(text);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;

        // Wake Word Recognition (Passive Listener)
        const wakeWordRec = new SpeechRecognition();
        wakeWordRec.continuous = true;
        wakeWordRec.interimResults = true;
        wakeWordRec.lang = 'en-US';
        
        wakeWordRec.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript.toLowerCase();
          // The magic wake words: "hey aypo", "emergency", "help me"
          if (text.includes('hey') || text.includes('aypo') || text.includes('emergency') || text.includes('help')) {
            if (!isOpen) {
              setWakeWordEnabled(false); // turn off to avoid echo
              handleOpen();
              speakText("Emergency Wake Word detected. I am listening. What is your emergency?");
              setTimeout(() => toggleListening(), 2000);
            }
          }
        };
        // Restart the wake word listener if it dies silently
        wakeWordRec.onend = () => {
          if (!isOpen && wakeWordEnabled) {
             try { wakeWordRec.start(); } catch (e) {}
          }
        };
        
        // Start passive listening on mount if enabled
        if (wakeWordEnabled && !isOpen) {
          try { wakeWordRec.start(); } catch (e) {}
        }

        return () => {
          try { wakeWordRec.stop(); } catch(e) {}
          if (synthRef.current) synthRef.current.cancel();
        };
      }
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [isOpen, wakeWordEnabled]);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSpeaking, isListening]);

  // Speak text using SpeechSynthesis
  const speakText = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel(); // stop previous speech

    const cleanText = text.replace(/[*_#•↗→]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query in the box below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  // Process User Command / Intent
  const handleProcessCommand = async (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    // Add user message
    const userMsg: VoiceMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setTranscript('');

    const lower = query.toLowerCase();
    let responseText = '';
    let actionType: string | undefined = undefined;

    // 1. Missing Person Reporting Intent
    if (lower.includes('missing') || lower.includes('lost') || lower.includes('report') || lower.includes('brother') || lower.includes('sister') || lower.includes('child') || lower.includes('family')) {
      responseText = "Opening the missing person emergency report form right now. Please provide their name, age, physical description, and last known location.";
      actionType = 'REPORT_MISSING';
      if (onReportMissing) setTimeout(onReportMissing, 1200);
    }
    // 2. Shelter / Evacuee Centre Intent
    else if (lower.includes('shelter') || lower.includes('camp') || lower.includes('food') || lower.includes('sleep') || lower.includes('refuge') || lower.includes('evacuat')) {
      responseText = "Navigating to authorized humanitarian relief shelters. Multiple camps are operational with food, clean water, and bedding.";
      actionType = 'OPEN_CENTRES';
      if (onOpenCentres) setTimeout(onOpenCentres, 1200);
    }
    // 3. Hospital / Medical / ICU Intent
    else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('bed') || lower.includes('icu') || lower.includes('medical') || lower.includes('blood') || lower.includes('trauma')) {
      responseText = "Displaying emergency trauma facilities and real-time ICU bed rosters. Coimbatore General Trauma Centre has open beds ready.";
      actionType = 'OPEN_HOSPITALS';
      if (onOpenHospitals) setTimeout(onOpenHospitals, 1200);
    }
    // 4. Helplines / Call / Police / Ambulance Intent
    else if (lower.includes('helpline') || lower.includes('call') || lower.includes('ambulance') || lower.includes('police') || lower.includes('number') || lower.includes('contact') || lower.includes('108') || lower.includes('112')) {
      responseText = "Opening the 24/7 Disaster Helplines directory. Dial 112 for immediate rescue, or 108 for ambulance emergency dispatch.";
      actionType = 'OPEN_HELPLINES';
      if (onOpenHelplines) setTimeout(onOpenHelplines, 1200);
    }
    // 5. Location / Coordinates / GPS Intent
    else if (lower.includes('where am i') || lower.includes('location') || lower.includes('coordinate') || lower.includes('gps') || lower.includes('map')) {
      try {
        const geo = await locationService.getCurrentPosition();
        responseText = `Your current GPS fix is confirmed at latitude ${geo.lat.toFixed(4)}, longitude ${geo.lng.toFixed(4)} in ${geo.locationName}. Opening disaster tactical map.`;
      } catch (e) {
        responseText = "Opening the live disaster map with your operational sector and verified relief points.";
      }
      actionType = 'OPEN_MAP';
      if (onOpenMap) setTimeout(onOpenMap, 1500);
    }
    // 6. Generic / Status
    else {
      responseText = "AYPO central response system is active. I can assist you with reporting missing family members, checking shelter capacities, hospital trauma beds, or calling emergency teams. How can I help?";
    }

    // Add assistant response
    const assistantMsg: VoiceMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      action: actionType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMsg]);
    speakText(responseText);
  };

  return (
    <>
      {/* Floating Persistent Siri / Gemini Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={handleOpen}
            className="group relative flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-black/90 hover:bg-black text-white border border-white/20 hover:border-cyan-400 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl"
            title="Open AYPO Emergency Voice Assistant (Siri / Gemini Response)"
          >
            {/* Glowing animated Siri/Gemini Orb */}
            <div className="relative w-8 h-8 rounded-full siri-orb flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>AI VOICE DISPATCH</span>
              </div>
              <div className="text-xs font-black text-white group-hover:text-cyan-200 transition-colors">
                Ask AYPO Assistant
              </div>
            </div>
          </button>
        )}
        
        {/* Wake word toggle */}
        {!isOpen && (
          <button
            onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
            className={`p-3 rounded-full border shadow-xl transition-all ${
              wakeWordEnabled 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-black/80 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Hands-Free Wake Word (Hey AYPO)"
          >
            {wakeWordEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Full Siri / Gemini Voice Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full sm:max-w-xl bg-[#07090E] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-cyan-950/80 flex flex-col h-[85vh] sm:h-[680px] overflow-hidden text-slate-100">
            
            {/* Top Bar */}
            <div className="p-4 bg-[#0A0D15] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full siri-orb flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-2">
                    <span>AYPO EMERGENCY VOICE COPILOT</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      SIRI / GEMINI MODE
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Real-Time Crisis Natural Language & Spoken Telemetry</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 rounded-xl border transition-colors ${
                    voiceEnabled 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title={voiceEnabled ? 'Voice Response Active (Click to mute)' : 'Voice Response Muted'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Siri / Gemini Animated Pulsing Orb & Wave Visualizer */}
            <div className="py-6 px-4 bg-gradient-to-b from-[#0A0D15] via-[#05070B] to-[#07090E] border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Pulsing Siri Orb */}
              <div 
                onClick={toggleListening}
                className={`relative w-20 h-20 rounded-full siri-orb flex items-center justify-center shadow-2xl cursor-pointer transition-transform duration-300 ${
                  isListening ? 'scale-110 ring-4 ring-cyan-400/80 animate-pulse' : 'hover:scale-105'
                }`}
                title="Tap to Speak with AYPO Assistant"
              >
                {isListening ? (
                  <Mic className="w-8 h-8 text-white animate-bounce" />
                ) : (
                  <Sparkles className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Status pill & Wave Bars */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 h-6">
                  {isSpeaking || isListening ? (
                    <>
                      <div className="voice-wave-bar" style={{ animationDelay: '0.1s' }} />
                      <div className="voice-wave-bar" style={{ animationDelay: '0.3s' }} />
                      <div className="voice-wave-bar" style={{ animationDelay: '0.2s' }} />
                      <div className="voice-wave-bar" style={{ animationDelay: '0.5s' }} />
                      <div className="voice-wave-bar" style={{ animationDelay: '0.4s' }} />
                    </>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      Tap the Orb or Mic to Speak
                    </span>
                  )}
                </div>

                <div className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  {isListening ? 'Listening to your voice...' : isSpeaking ? 'AYPO Assistant Speaking...' : 'Ready for Emergency Voice Input'}
                </div>

                {transcript && (
                  <div className="text-xs text-white bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/30 font-medium animate-fade-in max-w-sm text-center truncate">
                    "{transcript}"
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-500 font-mono mb-1 px-1">
                    {msg.sender === 'user' ? 'You' : 'AYPO AI Copilot'} • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md'
                        : 'bg-[#0E1320] border border-white/10 text-slate-200 shadow-md'
                    }`}
                  >
                    {msg.text}

                    {msg.action && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          Executed Action:
                        </span>
                        <span className="text-[10px] text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {msg.action}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="p-2.5 bg-[#080B12] border-t border-white/5 overflow-x-auto flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                Quick Prompts:
              </span>
              {[
                { label: 'Report Missing Person', action: () => handleProcessCommand('I want to report a missing family member') },
                { label: 'Find Nearest Shelter', action: () => handleProcessCommand('Where is the nearest relief shelter with beds?') },
                { label: 'Hospital Emergency Beds', action: () => handleProcessCommand('Which hospitals have open emergency ICU beds?') },
                { label: 'Call 112 / Helplines', action: () => handleProcessCommand('Give me emergency helpline numbers to call') },
                { label: 'Read My GPS Position', action: () => handleProcessCommand('What is my current verified GPS location?') },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={chip.action}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Text Input & Mic Control Bar */}
            <div className="p-3 bg-[#0A0D15] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProcessCommand(inputQuery);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask AYPO Assistant or speak command..."
                  className="flex-1 bg-black/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-bold transition-all"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
