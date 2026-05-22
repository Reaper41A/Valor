import { useState, useEffect, useRef } from "react";
import { BandwidthMode, Message, EducationArticle, ClinicResource } from "./types";
import { LANGUAGES, EDUCATION_ARTICLES, CLINICS } from "./data";
import BandwidthToggle from "./components/BandwidthToggle";
import SymptomTriageWizard from "./components/SymptomTriageWizard";
import MenstrualHealthHub from "./components/MenstrualHealthHub";
import {
  HeartPulse,
  Activity,
  BookOpen,
  MapPin,
  Volume2,
  VolumeX,
  Languages,
  Search,
  Phone,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  TrendingDown,
  ChevronRight,
  Droplet,
  Baby,
  ShieldAlert,
  HelpCircle,
  Menu,
  X,
  Compass
} from "lucide-react";

export default function App() {
  const [bandwidthMode, setBandwidthMode] = useState<BandwidthMode>("standard");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [activeTab, setActiveTab] = useState<"triage" | "education" | "clinics" | "menstrual">("triage");
  const [subTabTriage, setSubTabTriage] = useState<"guided" | "ai-chat">("guided");

  // Educational Hub filter states
  const [eduSearchQuery, setEduSearchQuery] = useState<string>("");
  const [eduCategory, setEduCategory] = useState<"all" | "maternal" | "infectious" | "first-aid" | "sanitation">("all");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Text-To-Speech read state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingArticleId, setSpeakingArticleId] = useState<string | null>(null);

  // Clinic list constraints
  const [clinicSearch, setClinicSearch] = useState<string>("");
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [transportMode, setTransportMode] = useState<"walking" | "bicycle" | "motorcycle">("walking");
  const [activeClinicId, setActiveClinicId] = useState<string | null>("cli-1");

  // Toast / Status banner notifications
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "warn" | "info"; message: string } | null>(null);

  // AI Assistant Screening states
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "⚠️ Community health guidance dashboard. I can helper you check urgent fever, cholera dehydration, maternity guidelines, or sanitation. Specify symptoms below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: "success" | "warn" | "info" = "info") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Scroll AI chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiLoading]);

  // Handle switching languages
  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    showToast(`Language switched to ${LANGUAGES.find(l => l.code === langCode)?.nativeName}`, "success");
    
    // Automatically translate or reword the first welcome message
    const welcomeMsgs: Record<string, string> = {
      en: "⚠️ Community health guidance dashboard. I can help you check urgent fever, cholera dehydration, maternal rules, or sanitation. Specify symptoms below.",
      sw: "⚠️ Msaidizi wa Afya ya Jamii. Ninaweza kukusaidia kuangalia homa, upungufu wa maji mwilini (kipindupindu), uzazi, au usafi wa mazingira. Andika dalili zako hapa chini.",
      fr: "⚠️ Assistant de santé communautaire. Je peux vous aider à évaluer la fièvre, la déshydratation liées au choléra, la maternité ou l'assainissement. Décrivez vos symptômes ci-dessous.",
      yo: "⚠️ Olùrànlọ́wọ́ Ìlera Agbègbè. Mo lè ràn ẹ́ lọ́wọ́ láti yẹ ibà wò, ìgbẹ́-shìshì (kólẹ́rà), ìtọ́jú aboyún, tàbí ìmọ́tótó. Kọ àwọn àmì àìsàn rẹ síbẹ̀.",
      zu: "⚠️ Umsizi Wezempilo Womphakathi. Ngingakusiza ukuhlola umkhuhlane, ukuphelelwa amanzi (ikholera), ukubeletha, noma ukuhlanzeka. Bhala izimpawu zakho ngezansi.",
      am: "⚠️ የማህበረሰብ ጤና ረዳት። ትኩሳት፣ የኮሌራ ድርቀትን፣ የእናቶች ጤና ወይም ንጽህናን ለመፈተሽ እረዳዎታለሁ። ምልክቶችዎን ከታች ይጻፉ።"
    };
    
    setChatMessages([
      {
        id: "welcome-" + langCode,
        role: "assistant",
        content: welcomeMsgs[langCode] || welcomeMsgs["en"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Text to Speech
  const toggleSpeech = (text: string, articleId: string) => {
    if (!('speechSynthesis' in window)) {
      showToast("Speech synthesis is unavailable in this browser layout.", "warn");
      return;
    }

    if (isSpeaking && speakingArticleId === articleId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingArticleId(null);
      showToast("Audio reading stopped", "info");
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for audio speech
    const plainText = text
      .replace(/#+\s+/g, "")
      .replace(/\*\*/g, "")
      .replace(/-\s+/g, "")
      .replace(/\n+/g, " ");

    const utterance = new SpeechSynthesisUtterance(plainText);
    const langVoiceMap: Record<string, string> = {
      en: "en-US",
      sw: "sw-KE",
      fr: "fr-FR",
      yo: "yo-NG",
      zu: "zu-ZA",
      am: "am-ET"
    };
    utterance.lang = langVoiceMap[selectedLanguage] || "en-US";
    utterance.rate = 0.95; // Slightly slower for crisp articulation

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingArticleId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingArticleId(null);
    };

    setIsSpeaking(true);
    setSpeakingArticleId(articleId);
    window.speechSynthesis.speak(utterance);
    showToast("Reading aloud with voice support...", "success");
  };

  // Terminate any reading on unmount or mode switch
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Post inquiry to local custom express proxy /api/chat
  const submitAiChat = async () => {
    if (!chatInput.trim()) return;
    if (bandwidthMode === "offline") {
      showToast("AI Chat requires online connectivity. Switch to guided Triage wizard.", "warn");
      return;
    }

    const nextUserMsg: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, nextUserMsg]);
    const inputPayload = chatInput;
    setChatInput("");
    setIsAiLoading(true);

    try {
      const activeLanguageName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English";
      // Send message history including system disclaimers
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...chatMessages, nextUserMsg].map(m => ({ role: m.role, content: m.content })),
          language: activeLanguageName
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        if (response.status === 503 && errJson.status === "API_KEY_MISSING") {
          throw new Error("Gemini API key is not configured in Secrets panel.");
        }
        throw new Error(errJson.error || "Server could not reply. Try checking your internet link.");
      }

      const resData = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "assistant",
          content: resData.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: `⚠️ Error: Could not get response. ${err.message || 'Please verify connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      showToast("AI connection error.", "warn");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter articles based on query + bandwidth optimization overrides
  const filteredArticles = EDUCATION_ARTICLES.filter((art) => {
    const matchesCategory = eduCategory === "all" || art.category === eduCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(eduSearchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(eduSearchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(eduSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate simulated transit times configuration
  const estimateTime = (dist: number, mode: "walking" | "bicycle" | "motorcycle") => {
    const minutesPerKm = {
      walking: 12.5,  // ~4.8 km/h
      bicycle: 5,     // ~12 km/h
      motorcycle: 1.8 // ~33 km/h
    };
    return Math.round(dist * minutesPerKm[mode]);
  };

  // Filter clinics by distance and search query
  const filteredClinics = CLINICS.filter((cli) => {
    const matchesSearch =
      cli.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      cli.district.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      cli.services.some(s => s.toLowerCase().includes(clinicSearch.toLowerCase()));
    
    const transitMin = estimateTime(cli.distanceKm, transportMode);
    // Allow any filter if no query
    return matchesSearch && cli.distanceKm <= maxDistanceKm;
  });

  const selectedClinic = CLINICS.find(c => c.id === activeClinicId) || CLINICS[0];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Dynamic Status / Toast notifications */}
      {toastMessage && (
        <div id="toast-banner" className="fixed top-4 right-4 z-50 transition-all duration-300 transform translate-y-0">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            toastMessage.type === "success" 
              ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
              : toastMessage.type === "warn" 
              ? "bg-rose-50 text-rose-950 border-rose-200" 
              : "bg-indigo-50 text-indigo-950 border-indigo-200"
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage.message}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 font-black cursor-pointer leading-none">×</button>
          </div>
        </div>
      )}

      {/* Main App Bar Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 hover:scale-105 transition-transform">
              <HeartPulse className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">Valor</h1>
                <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider">
                  Community Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Equitable access to basic health verification & triage</p>
            </div>
          </div>

          {/* Quick Controls Layout */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* REAL-TIME NETWORK SWITCHER & SIGNAL INDICATOR IN TOP CORNER */}
            <BandwidthToggle currentMode={bandwidthMode} onModeChange={setBandwidthMode} />

            {/* Language Picker Dropdown */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <div className="p-1 text-slate-500">
                <Languages className="w-4 h-4" />
              </div>
              <select
                id="language-select-dropdown"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent pr-2 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-800">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Support Hotline Info */}
            <div className="hidden lg:flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-3 py-1.5 text-[11px] font-bold">
              <Phone className="w-3.5 h-3.5 animate-pulsate" />
              <span>National Health Desk: 112 (Tol-Free)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* Informational low-bandwidth banners */}
        {bandwidthMode !== "standard" && (
          <div className="mb-6 bg-slate-100 border-l-4 border-slate-400 p-3.5 rounded-r-xl max-w-4xl mx-auto flex items-start gap-2.5 text-xs text-slate-700">
            <TrendingDown className="w-4 h-4 flex-shrink-0 text-slate-600 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600 bg-white border px-1.5 py-0.2 rounded mr-1.5">
                {bandwidthMode === "offline" ? "Cache Active" : "Compression On"}
              </span>
              {bandwidthMode === "offline" 
                ? "Showing only offline data and basic localized rules. Speech voices, maps and cloud AI services disabled to prevent balance consumption."
                : "Images replaced with text. AI screen output generated with maximum token budget restrictions to secure weak wireless networks."}
            </div>
          </div>
        )}

        {/* NAVIGATION TABS ACCENTED BY DESIGN PRINCIPLES */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex flex-wrap md:flex-nowrap gap-1 max-w-xl bg-slate-50 border p-1 rounded-2xl">
            <button
              id="tab-triage-trigger"
              onClick={() => setActiveTab("triage")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === "triage"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Symptom Checker
            </button>
            <button
              id="tab-education-trigger"
              onClick={() => setActiveTab("education")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === "education"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learn Safely
            </button>
            <button
              id="tab-clinics-trigger"
              onClick={() => setActiveTab("clinics")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === "clinics"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Local Clinics
            </button>
            <button
              id="tab-menstrual-trigger"
              onClick={() => setActiveTab("menstrual")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeTab === "menstrual"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-rose-500" />
              Menstrual Health
            </button>
          </div>
        </div>

        {/* TAB WORKSPACES */}
        <div className="space-y-6">
          {/* TAB 1: SYMPTOM SCREENING */}
          {activeTab === "triage" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LHS - Main Triage Mode Column */}
              <div className="lg:col-span-8 space-y-4">
                {/* Internal subtab navigation for Online Chat vs Guided Wizard */}
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Select Triage Engine</span>
                  <div className="flex space-x-2">
                    <button
                      id="subtab-guided"
                      onClick={() => setSubTabTriage("guided")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        subTabTriage === "guided"
                          ? "bg-indigo-50 border border-indigo-200 text-indigo-800"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      🗺️ Diagnostic Flow (Offline)
                    </button>
                    <button
                      id="subtab-ai-chat"
                      disabled={bandwidthMode === "offline"}
                      onClick={() => setSubTabTriage("ai-chat")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 leading-none ${
                        bandwidthMode === "offline" ? "opacity-40 cursor-not-allowed" : ""
                      } ${
                        subTabTriage === "ai-chat"
                          ? "bg-indigo-50 border border-indigo-200 text-indigo-800"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      🤖 Interactive AI Screening
                    </button>
                  </div>
                </div>

                {subTabTriage === "guided" ? (
                  /* Guided Checklist Flow (No connection required, fully local) */
                  <SymptomTriageWizard onSelectClinicTab={() => setActiveTab("clinics")} />
                ) : (
                  /* AI Interactive Chat Screening (Requires /api/chat connectivity) */
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
                    {/* Chat Window Head */}
                    <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-sm font-bold">
                          ✨
                        </div>
                        <div>
                          <h3 className="text-xs font-bold">Interactive AI Clinic Assistant</h3>
                          <p className="text-[10px] text-emerald-400 font-medium">Safe preliminary community triaging</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md border border-slate-755">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Gemini LLM Active
                      </div>
                    </div>

                    {/* Chat Area Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                      <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-[11px] text-indigo-950 font-medium space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-indigo-700" />
                          Emergency Safeguard Notice:
                        </div>
                        <p className="leading-relaxed leading-0.5">
                          This AI is configured for rural preventative assistance. If the patent has high infant fever, bleeding, heavy gasping/difficulty breathing, or rapid pulse go directly to <b>{CLINICS[3].name}</b> or call the toll-free helper.
                        </p>
                      </div>

                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed border ${
                            msg.role === "assistant"
                              ? "bg-white text-slate-800 border-slate-100 rounded-tl-none shadow-xs"
                              : "bg-indigo-600 text-white border-indigo-600 rounded-tr-none"
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span className={`block text-[9px] mt-1 text-right ${
                              msg.role === "assistant" ? "text-slate-400" : "text-white/60"
                            }`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}

                      {isAiLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                            <span>Computing clinical assessment...</span>
                          </div>
                        </div>
                      )}

                      <div ref={chatBottomRef} />
                    </div>

                    {/* Input Entry Box */}
                    <div className="border-t border-slate-100 p-3 bg-white flex gap-2">
                      <input
                        id="chat-symptom-input"
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitAiChat()}
                        placeholder="Write symptoms (e.g., 'Baby under 2 is shivering and feeling hot since yesterday')"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        id="chat-send-btn"
                        onClick={submitAiChat}
                        disabled={isAiLoading || !chatInput.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white p-3 rounded-xl transition duration-100 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RHS - Supportive Quick Links Column */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b pb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Offline Health Pocket Guide
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Always available without internet connection. Local recipes and preventative manuals.
                  </p>

                  <div className="space-y-2.5">
                    {EDUCATION_ARTICLES.slice(0, 3).map((art) => (
                      <button
                        key={art.id}
                        id={`quick-guide-${art.id}`}
                        onClick={() => {
                          setActiveTab("education");
                          setEduCategory("all");
                          setActiveArticleId(art.id);
                        }}
                        className="w-full flex items-center justify-between text-left p-3.5 bg-slate-50 hover:bg-slate-100 border rounded-2xl group transition duration-150 cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="inline-block text-[9px] font-black tracking-wider text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded mb-1 uppercase">
                            {art.category}
                          </span>
                          <h4 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-700">
                            {art.title}
                          </h4>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  <button
                    id="trigger-see-all-guides"
                    onClick={() => setActiveTab("education")}
                    className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-slate-50 py-2.5 rounded-xl block border border-dashed hover:border-indigo-300 transition"
                  >
                    Load Full Handbook &rarr;
                  </button>
                </div>

                {/* Local Homemade Rehydration Recipe */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🥛</span>
                    <h3 className="text-xs font-bold text-blue-900">Community Safety Solution</h3>
                  </div>
                  <h4 className="text-[11px] font-extrabold text-blue-950 uppercase mb-2">DIY Oral Rehydration Salts (ORS)</h4>
                  <p className="text-[10px] text-blue-800/90 leading-relaxed mb-3">
                    For sudden watery diarrhea, cholera or excessive vomiting. Stabilizes life during transport/clinic trips.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-[10px] text-blue-900 leading-relaxed">
                    <div className="flex justify-between border-b pb-1 mb-1">
                      <span>🧪 Clean Water</span>
                      <span className="font-bold">1 Liter (5 cups cooked)</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 mb-1">
                      <span>🧂 Raw Salt</span>
                      <span className="font-bold">1 / 2 Teaspoon (level)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🍬 Clean Sugar</span>
                      <span className="font-bold">6 Teaspoons (level)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MATERNAL & PREVENTATIVE HUB */}
          {activeTab === "education" && (
            <div className="space-y-6">
              {/* Header Selector / Searching controls */}
              <div className="bg-white rounded-2xl border p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "maternal", "infectious", "first-aid", "sanitation"] as const).map((cat) => (
                    <button
                      key={cat}
                      id={`edu-tag-${cat}`}
                      onClick={() => setEduCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        eduCategory === cat
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat === "all" ? "📚 All Guides" : cat.replace("-", " ")}
                    </button>
                  ))}
                </div>

                {/* Filter Input search bounds */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="education-finder-input"
                    type="text"
                    placeholder="Search handbooks (e.g., 'pregnancy', 'snake')"
                    value={eduSearchQuery}
                    onChange={(e) => setEduSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {eduSearchQuery && (
                    <button onClick={() => setEduSearchQuery("")} className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Handbooks directory render */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-150">
                  <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">No guides fit this description</h4>
                  <p className="text-xs text-slate-500 mt-1">Try resetting search filter criteria to display items.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((art) => {
                    const isExpanded = activeArticleId === art.id;
                    const isReaderSpeaking = isSpeaking && speakingArticleId === art.id;

                    return (
                      <div
                        key={art.id}
                        id={`edu-card-${art.id}`}
                        className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
                          isExpanded ? "md:col-span-2 lg:col-span-3 border-indigo-200 ring-1 ring-indigo-50" : "border-slate-150 hover:border-slate-250"
                        }`}
                      >
                        {/* Title portion */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {art.category}
                            </span>
                            
                            {/* Low Bandwidth Offline Safe Voice Support Tool */}
                            <button
                              id={`speak-btn-${art.id}`}
                              onClick={() => toggleSpeech(bandwidthMode === "standard" && !isExpanded ? art.summary : art.fullContent || art.summary, art.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                isReaderSpeaking
                                  ? "bg-rose-50 border border-rose-200 text-rose-700 animate-pulse"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                              title="Voice readout of instructions"
                            >
                              {isReaderSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              <span>{isReaderSpeaking ? "Stop Voice" : "Listen (TTS)"}</span>
                            </button>
                          </div>

                          <h3 className="text-[13px] font-bold text-slate-900 leading-snug">{art.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">{art.subtitle}</p>

                          {/* Render Details based on bandwidth modes and expand state */}
                          <div className="pt-3 border-t border-slate-100">
                            {bandwidthMode === "standard" && isExpanded ? (
                              <div className="space-y-4">
                                {/* Fully verbose material for broadband clients */}
                                <div className="text-xs text-slate-700 space-y-3 whitespace-pre-line leading-relaxed pb-3">
                                  {art.fullContent}
                                </div>

                                {/* Safety warnings box */}
                                <div className="p-4 bg-rose-50 border-l-4 border-rose-400 rounded-r-xl">
                                  <h4 className="text-[10px] font-black text-rose-950 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                                    Accidental Injury warning
                                  </h4>
                                  <ul className="list-disc pl-4 space-y-1 text-xs text-rose-900">
                                    {art.precautions.map((prec, n) => (
                                      <li key={n} className="leading-relaxed">{prec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              // Data saving summary bullet list
                              <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                                  {bandwidthMode === "standard" ? "Core Points Summary" : "Compressed Offline Guide"}
                                </span>
                                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium bg-slate-50 p-3 rounded-xl border">
                                  {art.summary}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expandable and actionable footer tabs */}
                        {bandwidthMode === "standard" && (
                          <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-end">
                            <button
                              id={`expand-toggle-${art.id}`}
                              onClick={() => setActiveArticleId(isExpanded ? null : art.id)}
                              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? "Close Handbook Detail ▲" : "Load Full Offline Detail ▼"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PUBLIC CLINIC REGISTRY */}
          {activeTab === "clinics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LHS - Configurator panel and results directory */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Search Parameters</h3>

                  {/* District / Text filter */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Find clinic or service</label>
                    <div className="relative">
                      <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="clinic-finder-search"
                        type="text"
                        placeholder="e.g., 'maternity', 'RDT test'"
                        value={clinicSearch}
                        onChange={(e) => setClinicSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Distance radius constraint */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-500 font-medium">Max Travel Distance</label>
                      <span className="text-xs font-black text-indigo-700">{maxDistanceKm} Kilometers</span>
                    </div>
                    <input
                      id="clinic-distance-ranger"
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={maxDistanceKm}
                      onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Estimated Transport Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Estimate Journey Time Mode</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["walking", "bicycle", "motorcycle"] as const).map((mode) => (
                        <button
                          key={mode}
                          id={`transport-mode-${mode}`}
                          onClick={() => setTransportMode(mode)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                            transportMode === mode
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clinics lists */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-semibold text-slate-500">{filteredClinics.length} Facilities Filtered</span>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                    {filteredClinics.map((cli) => {
                      const isSelected = activeClinicId === cli.id;
                      const calculatedTimeMin = estimateTime(cli.distanceKm, transportMode);

                      return (
                        <button
                          key={cli.id}
                          id={`clinic-list-item-${cli.id}`}
                          onClick={() => setActiveClinicId(cli.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-1.5 ${
                            isSelected
                              ? "bg-white border-indigo-200 ring-2 ring-indigo-50/50"
                              : "bg-white border-slate-150 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-[12px] font-bold text-slate-900 truncate">{cli.name}</h4>
                            <span className="text-[9px] font-black tracking-wider text-slate-500 bg-slate-100 py-0.5 px-1.5 rounded uppercase flex-shrink-0">
                              {cli.type === "dispensary" ? "Post" : cli.type === "primary-health-center" ? "Clinic" : "Hospital"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-semibold">
                              📍 {cli.distanceKm} km ({cli.district})
                            </span>
                            <span className="font-bold text-indigo-700 flex items-center gap-0.5">
                              ⏱️ ~{calculatedTimeMin} min
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RHS - Interactive Radar Map Locator Simulation & Clinic Stock Details */}
              <div className="lg:col-span-8 space-y-4">
                {/* 1. Offline Radar Locator Canvas */}
                <div className="bg-slate-950 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white-100 pb-2.5 mb-4 z-10 relative">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <h3 className="text-xs font-bold leading-none tracking-wider text-emerald-400 uppercase">
                        Offline GPS Radar Clinic Matcher
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">0.0 KB Data</span>
                  </div>

                  {/* Radar Layout Screen Grid */}
                  <div className="aspect-video bg-neutral-900 rounded-2xl relative flex items-center justify-center overflow-hidden border border-slate-800">
                    {/* Polar grid ripple lines */}
                    <div className="absolute w-[80%] aspect-square border border-emerald-500/10 rounded-full"></div>
                    <div className="absolute w-[50%] aspect-square border border-emerald-500/10 rounded-full animate-pulsate"></div>
                    <div className="absolute w-[20%] aspect-square border border-emerald-500/20 rounded-full"></div>
                    <div className="absolute h-full w-[1px] bg-emerald-500/5"></div>
                    <div className="absolute w-full h-[1px] bg-emerald-500/5"></div>

                    {/* Scanner Line swipe */}
                    <div className="absolute w-1/2 h-1 bg-gradient-to-r from-emerald-500/30 to-transparent top-1/2 left-1/2 origin-left animate-[spin_6s_linear_infinite]"></div>

                    {/* Patient/User Pin Dot at Center (0,0) */}
                    <div className="absolute z-20 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center font-bold text-[8px] text-white shadow-md animate-bounce">
                        🏠
                      </div>
                      <span className="bg-slate-900 border border-slate-700 text-white text-[9px] px-1 rounded-sm mt-1 scale-90 font-bold whitespace-nowrap">
                        You are here
                      </span>
                    </div>

                    {/* Nearby Hospital Dots on screen */}
                    {CLINICS.map((cli) => {
                      const isSelected = activeClinicId === cli.id;
                      // Translate abstract coordinates to offset styles
                      const styleLeft = `${cli.coordinates.x}%`;
                      const styleTop = `${cli.coordinates.y}%`;

                      return (
                        <div
                          key={cli.id}
                          style={{ left: styleLeft, top: styleTop }}
                          onClick={() => setActiveClinicId(cli.id)}
                          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-150 ${
                            isSelected
                              ? "bg-rose-500 border-white scale-140 z-20 shadow-lg"
                              : "bg-emerald-500 border-emerald-900 hover:scale-130 scale-100"
                          }`}>
                            <span className="text-[8px] text-white leading-none font-bold">
                              {cli.type === "referral-hospital" ? "H" : "+"}
                            </span>
                          </div>

                          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 text-[8px] font-bold text-slate-100 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-150">
                            {cli.name} ({cli.distanceKm}km)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2.5 text-center italic">
                     Simulation coordinates. Works seamlessly on offline mobile devices by utilizing integrated cache telemetry.
                  </p>
                </div>

                {/* 2. Detailed Facility Services & Critical Stocks Assessment */}
                <div className="bg-white rounded-3xl border p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3.5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{selectedClinic.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">District: <b>{selectedClinic.district}</b> • Open: <b>{selectedClinic.openHours}</b></p>
                    </div>
                    <a
                      href={`tel:${selectedClinic.contactNumber}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Contact Hotline
                    </a>
                  </div>

                  {/* Stock Levels Meter Indicators */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black tracking-widest text-slate-900 uppercase">Critical Medicines & Vaccines Stocks</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(selectedClinic.stockLevel).map(([medName, stockStatus]) => {
                        const styleMap: Record<string, { bg: string; text: string; pin: string }> = {
                          "High": { bg: "bg-emerald-50", text: "text-emerald-700", pin: "bg-emerald-500" },
                          "Medium": { bg: "bg-amber-50", text: "text-amber-800", pin: "bg-amber-500" },
                          "Low": { bg: "bg-rose-50", text: "text-rose-850", pin: "bg-rose-500" },
                          "Out of Stock": { bg: "bg-rose-100 animate-pulse", text: "text-rose-950", pin: "bg-rose-600" }
                        };
                        const displayLabels: Record<string, string> = {
                          malariaPills: "Malaria ACT Pills",
                          orsPackets: "ORS Packets",
                          vaccines: "Infant Vaccines",
                          antibiotics: "Antibiotics"
                        };
                        const style = styleMap[stockStatus] || styleMap["High"];

                        return (
                          <div key={medName} className={`rounded-2xl border border-slate-100 p-3 h-20 flex flex-col justify-between ${style.bg}`}>
                            <span className="text-[10px] font-bold text-slate-500 leading-tight">
                              {displayLabels[medName] || medName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className={`w-2 h-2 rounded-full ${style.pin}`}></span>
                              <span className={`text-[11px] font-black tracking-wide ${style.text}`}>{stockStatus}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Offered Services Checklist */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black tracking-widest text-slate-900 uppercase">Available Services & Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                      {selectedClinic.services.map((srv, index) => (
                        <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                          <span className="text-emerald-500 font-black">✔</span>
                          <span>{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WOMENS MENSTRUAL HEALTH */}
          {activeTab === "menstrual" && (
            <MenstrualHealthHub bandwidthMode={bandwidthMode} selectedLanguage={selectedLanguage} />
          )}
        </div>
      </main>

      {/* FOOTER DESK */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <HeartPulse className="w-5 h-5 text-indigo-500" />
              Valor
            </h3>
            <p className="text-[11px] text-slate-500">
              Basic clinical assistant prototype for underserved environments.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 text-center md:text-right space-y-1.5">
            <p>Built for Low-Bandwidth and Offline-First Operations (2G / Offline Capable).</p>
            <p>&copy; {new Date().getFullYear()} Valor Systems. Provided purely as informative material.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
