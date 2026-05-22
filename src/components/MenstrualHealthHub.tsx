import { useState, useEffect } from "react";
import { BandwidthMode } from "../types";
import {
  Calendar,
  Activity,
  HeartPulse,
  Flame,
  AlertOctagon,
  Sparkles,
  RefreshCw,
  Info,
  Layers,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  Baby,
  Bell,
  Volume2,
  ShieldAlert,
  Droplet
} from "lucide-react";
// @ts-ignore
import phasesImg from "../assets/images/menstrual_cycle_phases_1779455578746.png";
// @ts-ignore
import imbalanceImg from "../assets/images/hormonal_imbalances_1779455598215.png";
// @ts-ignore
import complicationsImg from "../assets/images/menstrual_gyn_troubles_1779455617317.png";

interface MenstrualHealthHubProps {
  bandwidthMode: BandwidthMode;
  selectedLanguage: string;
}

export default function MenstrualHealthHub({ bandwidthMode, selectedLanguage }: MenstrualHealthHubProps) {
  // Cycle Watcher details (persist in localStorage for sovereign offline security)
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(() => {
    const saved = localStorage.getItem("valor_last_period_date");
    if (saved) return saved;
    const date = new Date();
    date.setDate(date.getDate() - 10);
    return date.toISOString().split("T")[0];
  });
  
  const [cycleLength, setCycleLength] = useState<number>(() => {
    const saved = localStorage.getItem("valor_cycle_length");
    return saved ? Number(saved) : 28;
  });

  const [periodLength, setPeriodLength] = useState<number>(() => {
    const saved = localStorage.getItem("valor_period_length");
    return saved ? Number(saved) : 5;
  });

  // Dynamic evaluation date so users can "simulate" or check future months' dates
  const [evaluationDate, setEvaluationDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Alarm Preferences
  const [audioRemindersArmed, setAudioRemindersArmed] = useState<boolean>(() => {
    const saved = localStorage.getItem("valor_audio_reminders_armed");
    return saved ? saved === "true" : true;
  });

  const [smsSimulationsArmed, setSmsSimulationsArmed] = useState<boolean>(false);
  const [familyPhoneContact, setFamilyPhoneContact] = useState<string>(() => {
    return localStorage.getItem("valor_family_contact") || "";
  });

  // Track user actual menstrual symptoms
  const [loggedCramps, setLoggedCramps] = useState<boolean>(false);
  const [loggedBloating, setLoggedBloating] = useState<boolean>(false);
  const [loggedFatigue, setLoggedFatigue] = useState<boolean>(false);
  const [loggedClots, setLoggedClots] = useState<boolean>(false);

  // Test Notification Simulation triggers
  const [testNotificationActive, setTestNotificationActive] = useState<boolean>(false);

  // Focus sections
  const [activeImbalance, setActiveImbalance] = useState<"estrogen" | "progesterone" | "thyroid" | "prolactin">("estrogen");
  const [activeComp, setActiveComp] = useState<"pcos" | "endo" | "fibroids">("pcos");

  // Save changes block
  useEffect(() => {
    localStorage.setItem("valor_last_period_date", lastPeriodDate);
    localStorage.setItem("valor_cycle_length", cycleLength.toString());
    localStorage.setItem("valor_period_length", periodLength.toString());
    localStorage.setItem("valor_audio_reminders_armed", audioRemindersArmed.toString());
    localStorage.setItem("valor_family_contact", familyPhoneContact);
  }, [lastPeriodDate, cycleLength, periodLength, audioRemindersArmed, familyPhoneContact]);

  // Audio synthesis helper for retro offline alarm signals (zero-bandwidth, premium solution)
  const triggerOfflineBeepAlarm = () => {
    if (!audioRemindersArmed) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      
      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 880; // Crisp high tone
      gain1.gain.setValueAtTime(0.1, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);

      // Beep 2 (staggered)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1046.5; // High C
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.25);
      }, 250);

    } catch (e) {
      console.warn("AudioContext blocked or unavailable", e);
    }
  };

  // Run automatic alarm check if the current state is imminent and notifications are armed
  const triggerSimulatedAlarmPopup = () => {
    setTestNotificationActive(true);
    triggerOfflineBeepAlarm();
  };

  // Multi-lingual terminology dictionary
  const dictionary: Record<string, Record<string, string>> = {
    en: {
      trackerTitle: "Interactive Personal Cycle Watcher",
      lastPeriod: "First day of last period flow",
      cycleDuration: "Average cycle length (days)",
      periodDuration: "Average bleeding duration (days)",
      calculateBtn: "Recalculate Physiology",
      diagnosticTitle: "Endocrine & Hormonal Imbalance Pathways",
      complicationsTitle: "Significant Menstrual Complications & Conditions",
      safetyAlert: "Safe Community Support & Red Flags",
    },
    sw: {
      trackerTitle: "Kifaa cha Kufuatilia Mzunguko Binafsi",
      lastPeriod: "Siku ya kwanza ya hedhi iliyopita",
      cycleDuration: "Muda wa mzunguko (siku)",
      periodDuration: "Muda wa kutoa damu (siku)",
      calculateBtn: "Piga Hesabu upya",
      diagnosticTitle: "Mifumo ya Homoni na Kutokuwa na Usawa",
      complicationsTitle: "Matatizo Makuu ya Hedhi na Magonjwa",
      safetyAlert: "Usaidizi Salama wa Jamii na Ishara za Hatari",
    },
    fr: {
      trackerTitle: "Moniteur Interactif de Cycle Personnel",
      lastPeriod: "Premier jour des dernières règles",
      cycleDuration: "Durée moyenne du cycle (jours)",
      periodDuration: "Durée moyenne des saignements (jours)",
      calculateBtn: "Recalculer la physiologie",
      diagnosticTitle: "Voies d'Imbalance Endocrinienne & Hormonale",
      complicationsTitle: "Complications Menstruelles Majeures & Cancers",
      safetyAlert: "Soutien Communautaire Sûr & Signaux d'Alerte",
    }
  };

  const labels = dictionary[selectedLanguage] || dictionary["en"];

  // Precise mathematical model for multi-month cycling
  const calculateCyclePhases = () => {
    const lastDate = new Date(lastPeriodDate + "T00:00:00");
    const evalDate = new Date(evaluationDate + "T00:00:00");
    
    // Calculate raw duration difference in days
    const diffTime = evalDate.getTime() - lastDate.getTime();
    const diffDaysRaw = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Handle negative values if user set evaluation date prior to last period flow
    let elapsedDays = diffDaysRaw % cycleLength;
    if (elapsedDays < 0) {
      elapsedDays = cycleLength + elapsedDays;
    }

    // Determine current phase details
    let phaseName = "";
    let phaseDescription = "";
    let phaseHormoneState = "";
    let typicalSymptoms = "";
    let fertilityState = "";
    let advice = "";
    let phaseColor = "";

    if (elapsedDays >= 0 && elapsedDays < periodLength) {
      phaseName = "Menstruation Flow active (Days 1 - " + periodLength + ")";
      phaseColor = "border-rose-450 bg-rose-50/70 text-rose-950 shadow-md ring-2 ring-rose-200/50";
      phaseDescription = "Active shedding of the vascular uterine wall lining is occurring today since fertilization didn't occur during original egg cycles.";
      phaseHormoneState = "Estrogen and Progesterone values plummet to minimum baselines, signaling pituitary glands to release fresh follicle-stimulating hormone (FSH) to chose a new egg cell.";
      typicalSymptoms = "Uterine uterine contraction cramping, pelvic heavy aching, mild migraines, and low core physical fuel.";
      fertilityState = "Extremely Low - No follicular egg present yet.";
      advice = "Keep dry & cozy. Use sterile pads or boiled lint cloths. Avoid heavily salted grains or ice-cold well water to curb cramping levels. Consume bone-broth soup.";
    } else if (elapsedDays >= periodLength && elapsedDays <= 13) {
      phaseName = "Follicular Development (Days " + (periodLength + 1) + " - 13)";
      phaseColor = "border-amber-300 bg-amber-50/50 text-amber-950";
      phaseDescription = "Your brain releases follicle-stimulating blocks to ripen a healthy egg nestled inside safe ovarian sacs.";
      phaseHormoneState = "Estrogen rises sharply in steady gradients. This Estrogen trigger rebuilds the cellular endometrium tissue wall, preparing a soft lush bedding.";
      typicalSymptoms = "Rising stamina, clear vibrant emotional mood, moist translucent discharge, and healthy glowing skin texture.";
      fertilityState = "Moderate and Climbing - High possibility of sperm lifespan overlapping upcoming ovulation.";
      advice = "Add sprouted beans and amaranth green crops containing high natural iron to offset menstruation loss storage. Maintain good physical muscle routines.";
    } else if (elapsedDays === 14) {
      phaseName = "Ovulatory Peak Phase (Day 14)";
      phaseColor = "border-emerald-300 bg-emerald-50/50 text-emerald-950";
      phaseDescription = "The mature ovary releases a living egg cell down the fallopian tube, waiting for fertilization.";
      phaseHormoneState = "Luteinizing Hormone (LH) surges heavily acting as a biological trigger, with highest Estrogen levels. Progesterone begins its climbing release.";
      typicalSymptoms = "Mittelschmerz pelvic pain on one lower flank side, stretchy fluid looking like egg-white, and elevated core biological temperatures.";
      fertilityState = "MAXIMUM FERTILITY WINDOW. Egg cell remains viable for only 12-24 hours.";
      advice = "Highly cautious! This is your peak baby-making or child spacing step. If practicing child spacing, double down on barrier protections.";
    } else {
      phaseName = "Luteal Phase (Days 15 - " + cycleLength + ")";
      phaseColor = "border-indigo-300 bg-indigo-50/50 text-indigo-950";
      phaseDescription = "The empty egg follicle converts into the Corpus Luteum gland, producing dense hormones to secure the uterine soil.";
      phaseHormoneState = "Progesterone dominates this phase to secure the endometrial lining. If pregnancy is absent, Progesterone crashes down around Day 28, initiating the next flow.";
      typicalSymptoms = "Tender nipples, minor fluid logging (bloating), sweet or high starch appetite triggers, and high sensitivity to stress states.";
      fertilityState = "Dropping Rapidly - Approaching zero possibility as the egg cell decomposes.";
      advice = "Eat light whole foods, avoid refined cooking oil, and take plenty of spring water to help liver clean outer estrogen clusters. Get solid rest.";
    }

    // Expected Next Cycle Dates
    // The current cycle starts at: Evaluation Date - elapsedDays
    const evalDateObj = new Date(evaluationDate + "T00:00:00");
    const currentCycleStart = new Date(evalDateObj);
    currentCycleStart.setDate(currentCycleStart.getDate() - elapsedDays);
    
    const nextFlowExpectedStart = new Date(currentCycleStart);
    nextFlowExpectedStart.setDate(nextFlowExpectedStart.getDate() + cycleLength);

    const nextFlowExpectedEnd = new Date(nextFlowExpectedStart);
    nextFlowExpectedEnd.setDate(nextFlowExpectedEnd.getDate() + periodLength - 1);

    // Days until next flow from currently evaluated date
    const daysRemaining = Math.ceil((nextFlowExpectedStart.getTime() - evalDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if the evaluated date is around the corner
    const isAroundTheCorner = daysRemaining > 0 && daysRemaining <= 4;
    const isCurrentlyFlowing = elapsedDays >= 0 && elapsedDays < periodLength;

    return {
      elapsedDays,
      phaseName,
      phaseDescription,
      phaseHormoneState,
      typicalSymptoms,
      fertilityState,
      advice,
      phaseColor,
      nextFlowExpectedStart,
      nextFlowExpectedEnd,
      daysRemaining,
      isAroundTheCorner,
      isCurrentlyFlowing
    };
  };

  const {
    elapsedDays,
    phaseName,
    phaseDescription,
    phaseHormoneState,
    typicalSymptoms,
    fertilityState,
    advice,
    phaseColor,
    nextFlowExpectedStart,
    nextFlowExpectedEnd,
    daysRemaining,
    isAroundTheCorner,
    isCurrentlyFlowing
  } = calculateCyclePhases();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* TEST ALARM BANNER (Simulated SMS and Loud Beep Indicator to prevent shock) */}
      {testNotificationActive && (
        <div className="bg-rose-600 text-white rounded-2xl border-2 border-rose-300 p-5 shadow-xl animate-bounce flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl animate-pulse">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">🚨 EMERGENCE CYCLE WATCHER WARNING!</h3>
              <p className="text-xs text-rose-100">
                {isCurrentlyFlowing 
                  ? "Alert: Your menstrual flow is ACTIVE today. Keep materials of clean pads on your body!"
                  : `Alert: Menstrual cycle expected in ${daysRemaining} days (around the corner)! Pack towels and pads in your bag!`}
              </p>
              {familyPhoneContact && (
                <p className="text-[11px] text-rose-200 mt-1 italic">
                  *Simulated safety alert broadcasted to your contact: <b>{familyPhoneContact}</b>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { triggerOfflineBeepAlarm(); }}
              className="bg-rose-950 hover:bg-rose-900 border border-rose-500 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> Re-trigger Beep
            </button>
            <button
              onClick={() => setTestNotificationActive(false)}
              className="bg-white text-rose-900 hover:bg-rose-100 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer"
            >
              Acknowledge & Dismiss
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: INTERACTIVE CALCULATOR ENGINE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Main Status Panel */}
        <div className="bg-indigo-900 text-white p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-400/20">
              <Droplet className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {labels.trackerTitle}
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse whitespace-nowrap">
                  🚨 ALARM CONSOLE ACTIVE
                </span>
              </h2>
              <p className="text-xs text-indigo-200">Personal expectancy monitoring, countdowns, and sound indicators</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Countdown / Current state badge */}
            <div className="bg-indigo-950 border border-indigo-700 rounded-xl px-4 py-2 text-xs font-bold text-center flex-grow sm:flex-grow-0">
              {isCurrentlyFlowing ? (
                <span className="text-rose-400 font-extrabold text-sm flex items-center justify-center gap-1">
                  🩸 DAY {elapsedDays + 1} OF FLOW
                </span>
              ) : isAroundTheCorner ? (
                <span className="text-amber-400 font-extrabold text-sm flex items-center justify-center gap-1 animate-pulse">
                  ⚠️ PRE-FLOW: {daysRemaining} DAYS LEFT
                </span>
              ) : (
                <span className="text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-1">
                  ⏳ {daysRemaining} DAYS TO FLOW
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cycle Input configurations (LHS) */}
          <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">Watcher Baseline</h3>
              <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">Stored Offline</span>
            </div>

            <div className="space-y-1">
              <label htmlFor="watcher-last-flow" className="text-xs font-semibold text-slate-600 block">{labels.lastPeriod}</label>
              <input
                id="watcher-last-flow"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full bg-white border border-slate-350 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-600">{labels.cycleDuration}</label>
                <span className="text-xs font-black text-indigo-700">{cycleLength} days</span>
              </div>
              <input
                id="watcher-cycle-range"
                type="range"
                min="21"
                max="35"
                step="1"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-600">{labels.periodDuration}</label>
                <span className="text-xs font-black text-rose-600">{periodLength} days</span>
              </div>
              <input
                id="watcher-period-range"
                type="range"
                min="3"
                max="8"
                step="1"
                value={periodLength}
                onChange={(e) => setPeriodLength(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Adjustable target evaluation date (Critical for predicting future states) */}
            <div className="space-y-1 pt-1 border-t border-slate-200/65">
              <div className="flex items-center justify-between">
                <label htmlFor="watcher-eval-date" className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                  Predict Future State
                </label>
                <button
                  onClick={() => setEvaluationDate(new Date().toISOString().split("T")[0])}
                  className="text-[10px] text-indigo-700 hover:underline font-bold"
                >
                  Reset To Today
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-1.5">Change date below to preview upcoming alerts ahead of schedule</p>
              <input
                id="watcher-eval-date"
                type="date"
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                className="w-full bg-indigo-50/55 border border-indigo-250 rounded-xl p-2.5 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
              />
            </div>
          </div>

          {/* Alert Monitor & Dynamic Companion Panel (RHS) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
            {/* ACTIVE DYNAMIC ALERTER MODULE */}
            <div className={`border-2 rounded-2xl p-5 ${phaseColor} relative overflow-hidden`}>
              {/* Flashing glow lights for imminent period threat */}
              {isAroundTheCorner && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500 animate-pulse"></div>
              )}
              {isCurrentlyFlowing && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-rose-600 animate-pulse"></div>
              )}

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/90 border border-slate-200 px-2.5 py-0.5 rounded shadow-xs inline-flex items-center gap-1">
                  {(isCurrentlyFlowing || isAroundTheCorner) ? (
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                  Critical Prediction Warning
                </span>
                
                <span className="text-[11px] font-extrabold text-slate-500">
                  Targeted Date: {new Date(evaluationDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>

              {/* Status Alert Badge */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  {(isCurrentlyFlowing || isAroundTheCorner) ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  <h3 className="text-base font-black leading-tight">{phaseName}</h3>
                </div>
                
                <p className="text-xs font-semibold opacity-95 leading-relaxed bg-white/50 border rounded-xl p-3">
                  {isCurrentlyFlowing ? (
                    <span className="text-rose-955">
                      <b>🩸 Flow Active:</b> Bleeding began {elapsedDays} days ago, expected to finish in <b>{periodLength - elapsedDays} days</b> (on {nextFlowExpectedStart.toLocaleDateString() === new Date(evaluationDate + "T00:00:00").toLocaleDateString() ? "Tomorrow" : nextFlowExpectedEnd.toLocaleDateString("en-US", {month: "short", day: "numeric"})}).
                    </span>
                  ) : isAroundTheCorner ? (
                    <span className="text-amber-955 animate-pulse">
                      <b>🚨 Pre-Flow Trigger:</b> Your bleeding window starts in only <b>{daysRemaining} day{daysRemaining > 1 ? "s" : ""}</b>! Pack emergency menstrual materials now to prevent any public leaks or surprise flow stress.
                    </span>
                  ) : (
                    <span className="text-indigo-955">
                      Your period bleeding was completed recently. Standard state. Next menstruation is scheduled in <b>{daysRemaining} days</b> (starts {nextFlowExpectedStart.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})} and ends {nextFlowExpectedEnd.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}).
                    </span>
                  )}
                </p>
                
                <p className="text-xs opacity-90 leading-relaxed pt-1">{phaseDescription}</p>
              </div>

              {/* Dynamic Wave metrics inside dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-200/60 text-xs">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-1 flex items-center gap-1">
                    🔬 Endocrine Wave Status
                  </h4>
                  <p className="leading-relaxed text-slate-700">{phaseHormoneState}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-1 flex items-center gap-1">
                    🦪 Present Target Symptoms
                  </h4>
                  <p className="leading-relaxed text-slate-700">{typicalSymptoms}</p>
                </div>
              </div>
            </div>

            {/* PREPARATORY ADVICE SUB-SECTION (Tailored to never catch them off-guard) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                Special Protective & Preparatory Guidelines
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {calculateCyclePhases().advice ? (
                  <div className="col-span-2 text-xs text-slate-700 space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-slate-150 space-y-1.5 shadow-2xs">
                      <p className="font-extrabold text-slate-900 text-xs text-rose-700 uppercase tracking-wide">🔬 Target Preparations (For this stage):</p>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-700 font-medium">
                        {calculateCyclePhases().advice.split(".").filter(Boolean).map((s, idx) => (
                          <li key={idx} className="leading-relaxed">{s.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {/* Additional universal advice list representing physical actions */}
                <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1 shadow-2xs text-[11px]">
                  <p className="font-bold text-indigo-900 uppercase">👜 Essential Core Carry Package:</p>
                  <p className="text-slate-600 leading-normal">
                    Always maintain 1 raw unused envelope of sterilized cotton paddings, 1 spare clean brief, and 1 mini seal pouch in your default work bag.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1 shadow-2xs text-[11px]">
                  <p className="font-bold text-indigo-900 uppercase">🛡️ Dispensary Support Alert:</p>
                  <p className="text-slate-600 leading-normal">
                    If severe bleed soakings force pad replacements in less than 2 hours, or clotting size exceeds a small chicken egg, seek immediate district hospital testing checks.
                  </p>
                </div>
              </div>
            </div>

            {/* LIVE ALERT ACTIONS & SMS SIMULATION PANEL */}
            <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-slate-700 uppercase">🔔 Offline Alarms Configuration</h5>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={audioRemindersArmed}
                      onChange={(e) => setAudioRemindersArmed(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Armed Audio Signals (Offline Sound Beeps)</span>
                  </label>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Generates diagnostic double beep sounds directly when current evaluation approaches pre-flow period.
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase">👩‍👩‍👧 Family Safety Broadcast</h5>
                  <span className="text-[9px] text-rose-600 font-extrabold bg-rose-50 border px-1.5 rounded uppercase">Offline Pager</span>
                </div>
                
                <p className="text-[10px] text-slate-400">Trigger simulated SMS reminder warnings to family or mothers when cycle is imminent:</p>
                
                <div className="flex gap-2.5 mt-1.5">
                  <input
                    id="family-phone"
                    type="tel"
                    placeholder="Enter phone..."
                    value={familyPhoneContact}
                    onChange={(e) => setFamilyPhoneContact(e.target.value)}
                    className="bg-white border text-xs font-bold rounded-xl p-2 w-full focus:outline-none"
                  />
                  <button
                    id="trigger-sms-test-btn"
                    onClick={() => {
                      triggerSimulatedAlarmPopup();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-2 rounded-xl transition cursor-pointer whitespace-nowrap"
                  >
                    Test Alert System
                  </button>
                </div>
              </div>
            </div>

            {/* SYMPTOMS LOGGING SUBMODULE */}
            <div className="bg-indigo-50/40 border border-indigo-150 rounded-2xl p-4">
              <h5 className="text-xs font-black text-indigo-950 uppercase mb-2 flex items-center justify-between">
                <span>📝 Active Physiological Symptom Diary (Evaluation Date)</span>
                <span className="text-[10px] text-indigo-600 normal-case font-medium">Click to log checkmarks</span>
              </h5>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "cramps", label: "Lower Cramp Aches", checked: loggedCramps, set: setLoggedCramps, icon: "⚡" },
                  { id: "bloat", label: "Abdominal Bloat", checked: loggedBloating, set: setLoggedBloating, icon: "🎈" },
                  { id: "fatigue", label: "Severe Exhaustion", checked: loggedFatigue, set: setLoggedFatigue, icon: "🥱" },
                  { id: "clots", label: "Dark Tissue Clots", checked: loggedClots, set: setLoggedClots, icon: "🔴" },
                ].map((s) => (
                  <button
                    key={s.id}
                    id={`symptom-diary-${s.id}`}
                    onClick={() => s.set(!s.checked)}
                    className={`p-2.5 rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-between text-left ${
                      s.checked 
                        ? "bg-rose-50 border-rose-300 text-rose-950 shadow-xs ring-1 ring-rose-200" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{s.icon} {s.label}</span>
                    <span className="text-rose-600 text-[10px]">{s.checked ? "✓" : "+"}</span>
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Dynamic Image explaining Cycle Phases */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800">Menstrual Cycle & Hormone Fluctuations Handbook</h4>
            </div>

            {bandwidthMode === "standard" ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xs">
                <img
                  src={phasesImg}
                  alt="Anatomical diagram of Menstrual Cycle and Estrogen/Progesterone waveforms"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[380px] rounded-xl hover:scale-[1.01] transition-all duration-300"
                />
              </div>
            ) : (
              // Compression/Offline mode alternative diagram as visual ASCII table representation
              <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                <div className="border-b border-emerald-500/30 pb-1 mb-2 font-bold text-center">
                  CYCLE COMPLEMENTARITY WAVEFORM (LOW-BANDWIDTH HIGH RESOLUTION REPLACEMENT)
                </div>
                <div>Day count:  01 | 03 | 05 | 07 | 09 | 11 | 13 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28</div>
                <div>Estrogen:  __\____/--------\__________/\___/\_______________/-------\____/_____ (Peaking at Ovulation)</div>
                <div>Progest:   __________\__________________________/\________________________/----\__ (Climbing in Luteal)</div>
                <div>--------------------------------------------------------------------------------</div>
                <div className="text-slate-300">Phase:     [--Menstrual-] [--Follicular---] [*Ovulate*] [-----------Luteal-----------]</div>
                <div className="text-slate-300">UT-Lining:  ----Shedding-   ---Rebuilding--  ---Thick--   ---------Lush/Secure--------</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: ENDOCRINE PATHWAYS & HORMONAL IMBALANCES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b pb-4 mb-6">
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl">
            <Activity className="w-5.5 h-5.5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{labels.diagnosticTitle}</h2>
            <p className="text-xs text-slate-500">How glands interact, symptoms of biochemical anomalies, and complications pathways</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pathway Selector */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: "estrogen", name: "Estrogen Dominance", details: "Excess estrogen path", icon: "🔴" },
              { id: "progesterone", name: "Progesterone Deficiency", details: "Missed egg cell releases", icon: "🟡" },
              { id: "thyroid", name: "Thyroid Gland (T3/T4)", details: "Metabolic and pulse blocks", icon: "🔵" },
              { id: "prolactin", name: "Hyperprolactinemia", details: "Breastfeeding spacing path", icon: "🟣" },
            ].map((p) => (
              <button
                key={p.id}
                id={`imbalance-btn-${p.id}`}
                onClick={() => setActiveImbalance(p.id as any)}
                className={`w-full text-left p-3.5 rounded-xl border transition duration-150 cursor-pointer ${
                  activeImbalance === p.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-950 hover:bg-indigo-50"
                    : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{p.details}</p>
              </button>
            ))}
          </div>

          {/* Deep Information Screen */}
          <div className="lg:col-span-9 space-y-5">
            {activeImbalance === "estrogen" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-rose-950 uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1 rounded inline-block">
                  Estrogen Dominance Pathway
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">What It Is & Biochemical Mechanism:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Estrogen is meant to build tissues, while Progesterone dampens and controls its growth. When there is excessive estrogen relative to progesterone, cells inside the womb are constantly stimulated. This often happens because of exposure to commercial plastic compounds mimicking estrogen, elevated liver fatigue, or failure to release an egg (anovulation).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔴 Primary Physical Symptoms:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Uterine tissue overgrowth causing massive heavy periods with dark tissue clots.</li>
                      <li>Severe, tender swelling in outer breast glands.</li>
                      <li>Rapid and unexplained weight gains on thighs and hips.</li>
                      <li>Severe migraine headaches prior to period bleeding.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">⚡ Pathological Complications:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Heavy formation of muscular benign tumors (**Fibroids**) inside uterus walls.</li>
                      <li>Thickening of the vaginal lining leading to intense pain (**Endometriosis**).</li>
                      <li>Long-term risk of endometrial cells transforming into severe malignancies.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 text-indigo-950 font-semibold rounded-xl border border-indigo-150 text-xs">
                  🌱 <b>Community Preventative Supports:</b> Limit processed oily carbohydrates. Prioritize cabbage, broccoli, and organic local dark mustard greens. These contain *Indole-3-Carbinol* matching liver pathways to eliminate stale excess Estrogens cleanly.
                </div>
              </div>
            )}

            {activeImbalance === "progesterone" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-1 rounded inline-block">
                  Progesterone Deficiency Pathway
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">What It Is & Crucial Physiological Role:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Progesterone is the nourishing hormone of the second half of the cycle, produced by the ruptured egg sac (corpus luteum). If a follicle fails to mature or release an egg (which can happen under heavy physical stress, low nutrition, or PCOS), no Progesterone is created. Chronic stress yields high cortisol, which physically steals and block progesterone access sites.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🟡 Common Warning Signs:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Very irregular or missed periods since no uterine security is maintained.</li>
                      <li>Noticeable brown dripping spotting days before menstruation actual start.</li>
                      <li>Severe sleep disturbances, panic episodes, or high anxiety behaviors.</li>
                      <li>Rapid body temperature drops under pre-menstrual stage.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">⚡ Secondary Complications:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Subfertility & Early Pregnancy Loss**: The uterine soil has no structural security to support a growing egg cluster, triggering miscarriages.</li>
                      <li>Chronic fluid bloating and uncurbed mood swings prior to cycle.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 text-indigo-950 font-semibold rounded-xl border border-indigo-150 text-xs">
                  🥣 <b>Community Food Balance:</b> Add zinc and magnesium-dense cereals (whole millet, sorghum, pumpkin seeds). Ensure 8 hours of deep night sleep to lower adrenaline levels blockages.
                </div>
              </div>
            )}

            {activeImbalance === "thyroid" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded inline-block">
                  Thyroid Hormonal Axis Complications
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">What It Is & Cycle Interactions:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The Thyroid gland in the neck regulates the metabolic fuel and speed of every cell in your body, containing intense links to ovaries. When the thyroid gland creates too little helper hormone (**Hypothyroidism**), your brain cannot trigger proper LH/FSH surges, resulting in complete failure to release an egg.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔵 Low Thyroid (Hypothyroidism):</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Very heavy, long-lasting clotting periods.</li>
                      <li>Chronic extreme fatigue where body feels weak even after rest.</li>
                      <li>Cold skin, cold sensitivity, and dry coarse hair.</li>
                      <li>Swelling in lower legs and unexplained weight gains.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔵 Overactive Thyroid (Hyperthyroidism):</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Extremely sparse, watery, or completely absent periods.</li>
                      <li>Unusually fast heartbeat (palpitations) and hot palms.</li>
                      <li>Drastic, unhealthy rapid weight loss.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 text-indigo-955 font-semibold rounded-xl border border-indigo-150 text-xs flex gap-2">
                  <span className="text-base">🧂</span>
                  <div>
                    <b>Rural Goiter & Thyroid Preventions:</b> Ensure use of certified Iodized Salt in cooking. Iodine is the essential amino bricks for Thyroid hormone synthesis. Store salt in air-tight closed jars to prevent volatile iodine escapes.
                  </div>
                </div>
              </div>
            )}

            {activeImbalance === "prolactin" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-purple-900 uppercase tracking-widest bg-purple-50 border border-purple-100 px-3 py-1 rounded inline-block">
                  Hyperprolactinemia & Natural Bracing
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">What It Is & Physiological Natural Contraception:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prolactin is a pituitary hormone produced primarily during breastfeeding of infants. High levels of Prolactin act directly as a natural switch to block GnRH (Gonadotropin-Releasing Hormone), preventing ovulation. This serves as a vital community health child-spacing mechanism called the **Lactational Amenorrhea Method (LAM)**.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-850 uppercase mb-2">🟣 Breastfeeding LAM Criteria:</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      For LAM to successfully protect against immediate secondary pregnancy (98% effectiveness), the family must strictly fulfill:
                    </p>
                    <ul className="list-decimal pl-4 text-xs text-slate-600 space-y-1 mt-1.5 font-medium">
                      <li>Infant is under 6 months old.</li>
                      <li>The mother breastfeeds exclusively without supplementary formula, porridge, or water.</li>
                      <li>Menstrual bleeding has not returned.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <h5 className="text-[11px] font-bold text-slate-850 uppercase mb-2">🟣 Non-Lactating Excess Prolactin:</h5>
                    <p className="text-[11px] text-slate-650 leading-relaxed mb-1">
                      If prolactin is elevated without active breastfeeding, it represents a pathological anomaly:
                    </p>
                    <ul className="list-disc pl-4 text-xs text-slate-650 space-y-1">
                      <li>Spontaneous milky discharge from breast ducts.</li>
                      <li>Complete cessation of menstruations (amenorrhea).</li>
                      <li>Possible benign brain tumor (prolactinoma) requiring hospital medication.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic comparison image showing hormonal imbalance changes */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-6 mt-6 rounded-2xl">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800">Visual Comparison: Balanced vs. Imbalanced Glandular Cycles</h4>
            </div>

            {bandwidthMode === "standard" ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xs">
                <img
                  src={imbalanceImg}
                  alt="Anatomical diagram comparing balanced scales of estrogen and progesterone against unbalanced scales"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[350px] rounded-xl hover:scale-[1.01] transition-all duration-300"
                />
              </div>
            ) : (
              // Compression/Offline mode text representation
              <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">
                  Low-Bandwidth Diagram Alternation Table
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <h5 className="text-xs text-emerald-800 font-bold">1. NORMAL BALANCED AXIS</h5>
                    <p className="text-[11px] text-emerald-900 mt-1 leading-relaxed">
                      Progesterone balances out Estrogen growth signals. Ovaries cleanly release egg cells. Menstruation occurs sequentially with normal fluid levels (less than 80ml, thin, non-clotted).
                    </p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
                    <h5 className="text-xs text-rose-800 font-bold">2. STIMULATED IMBALANCE AXIS</h5>
                    <p className="text-[11px] text-rose-900 mt-1 leading-relaxed">
                      Estrogen spikes high, overshadowing low Progesterone. Internal womb tissue thickens aggressively. Uterus suffers intense heavy bleeding, clotting, and extreme physical exhaustion (Anemia).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: GYNAECOLOGICAL CONDITIONS & COMPLICATIONS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b pb-4 mb-6">
          <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertOctagon className="w-5.5 h-5.5 text-rose-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{labels.complicationsTitle}</h2>
            <p className="text-xs text-slate-500">Chronic clinical syndromes, organic defects, and local triage strategies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Component Tabs selection */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: "pcos", name: "PCOS (Polycystic Ovaries)", details: "Cysts & insulin axis", icon: "🟣" },
              { id: "endo", name: "Endometriosis", details: "Painful localized tissues", icon: "🔴" },
              { id: "fibroids", name: "Uterine Fibroids", details: "Prolonged heavy hemorrhages", icon: "🟤" },
            ].map((c) => (
              <button
                key={c.id}
                id={`comp-btn-${c.id}`}
                onClick={() => setActiveComp(c.id as any)}
                className={`w-full text-left p-3.5 rounded-xl border transition duration-150 cursor-pointer ${
                  activeComp === c.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-950 hover:bg-indigo-50"
                    : "bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{c.details}</p>
              </button>
            ))}
          </div>

          {/* Complication Deep Content details */}
          <div className="lg:col-span-9 bg-slate-50/50 p-6 rounded-2xl border">
            {activeComp === "pcos" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-purple-900 uppercase tracking-widest bg-purple-50 border border-purple-100 px-3 py-1 rounded inline-block">
                  Polycystic Ovary Syndrome (PCOS)
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">Anatomy, Pathways & Glandular Cause:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PCOS is a genetic insulin-resistant endocrine disorder. Because of high insulin levels, the ovaries secrete excessive levels of male hormone (**Androgen**). Follicles try to mature but halt mid-growth, forming multiple small fluid-filled pockets (resembling a string of pearls) rather than releasing eggs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔍 Clinical Diagnostic Triad:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Highly erratic or complete stop in periods**: Less than 8 cycles a entire year.</li>
                      <li>**Hyperandrogenism**: Unusual dark coarse hair on face, jawline, chin (Hirsutism), or intense acne.</li>
                      <li>Polycystic ovaries viewed on basic ultrasound matching fluid micro-sacs.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">⚡ Long-term Complications:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Development of chronic Type 2 Diabetes at young age.</li>
                      <li>Infertility due to chronic absence of egg release.</li>
                      <li>Chronically elevated blood pressure and lipid failures.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-semibold">
                  🌿 <b>Community Lifestyle Modification Steps (Low-Cost Solution):</b> Avoid sugar juices, wheat flour and white rice. Transition exclusively to slow-burning carbohydrates (sweet potatoes, boiled cassava, finger millet porridge). Walk 35 minutes directly following meals to activate muscles to absorb and lower insulin spikes safely.
                </div>
              </div>
            )}

            {activeComp === "endo" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-rose-900 uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1 rounded inline-block">
                  Endometriosis
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">Physiology & Pain Pathology:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Endometriosis is a highly painful progressive disease where cells identical to the inner uterine lining (endometrium) grow *outside* the womb—on ovaries, bladder, bowel or peritoneal floor. Each month during bleeding, these out-of-place tissues bleed as well, but the blood remains trapped, causing severe local chemical inflammation and hard scar tissue fusion.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔍 Core Physical Warning Markers:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Incapacitating period pains** that make standard work or walking impossible.</li>
                      <li>Severe, deep pain during marital intimacy.</li>
                      <li>Heavy painful bleeding when using the toilet during menstruation.</li>
                      <li>Persistent pelvic ache all month long.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">⚡ Severe Complications:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Substantial Infertility (up to 40% of cases)**: Scar tissues block and weld shut the delicate Fallopian tubes, preventing sperm from ever reaching egg clusters.</li>
                      <li>Formation of severe bleeding cysts on ovaries (Chocolate Cysts).</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-xl text-xs text-rose-950 font-semibold leading-relaxed">
                  ⚠️ <b>Crucial Clinic Note:</b> Direct sufferers to never dismiss pain as "normal weakness." Early diagnosis can lead to laparoscopic clinic care to remove scarring and restore child-birth capabilities.
                </div>
              </div>
            )}

            {activeComp === "fibroids" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-1 rounded inline-block">
                  Uterine Fibroids (Myomas)
                </h3>
                <h4 className="text-sm font-extrabold text-slate-900">Anatomical Defects & Bleeding Risks:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fibroids are non-cancerous muscular knots/tumors growing within the uterine wall. Highly prevalent in women of African origin, they expand aggressively in response to Estrogen spikes. Large fibroids stretch out the uterus interior surface area, preventing healthy muscular constriction needed to curb normal monthly bleeding.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">🔍 Visible Warning Signs:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Water-hose periods** that soak clothing rapidly or cause visible puddles.</li>
                      <li>Periods lasting longer than 8 consecutive days.</li>
                      <li>A hard, firm, visible bulge in lower abdomen (feels like a 3-month pregnancy).</li>
                      <li>Constant urgent need to urinate as tumor presses hard onto bladder.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase mb-2">⚡ Pathological Complications:</h5>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>**Severe Iron-Deficiency Anemia**: Loss of red cells leading to zero oxygen, profound breathlessness during tiny tasks, and pale eyelids/palms.</li>
                      <li>High risk of massive bleeding emergencies during pregnancy.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-250 text-xs text-slate-700 leading-relaxed font-semibold">
                  💊 <b>Triage & Care Steps:</b> Sufferers of extreme bleeding require an immediate blood count (Hemoglobin test) to check for severe anemia at the district referral hospital. Safe medical options (progestin tablets, myomectomy surgery, coil inserts) are highly effective.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic image showing Gynecological diagram */}
        <div className="border-t border-slate-100 bg-slate-50/40 p-6 mt-6 rounded-2xl">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800">Visual Anatomical Diagrams: Ovarian Cysts, Fibroids & Endometriosis Tissues</h4>
            </div>

            {bandwidthMode === "standard" ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xs">
                <img
                  src={complicationsImg}
                  alt="Anatomical diagram visualizing PCOS cysts, fibroids, endometriosis"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[350px] rounded-xl hover:scale-[1.01] transition-all duration-300"
                />
              </div>
            ) : (
              // Compression/Offline mode textual alternative
              <div className="bg-slate-50 p-4 rounded-xl border leading-relaxed space-y-2">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-widest">
                  Low-Bandwidth Diagram Interpretation
                </span>
                <ul className="text-xs text-slate-750 space-y-2.5 list-none pl-1">
                  <li className="flex gap-1.5 items-start">
                    <span className="text-indigo-600 font-bold">⭕ PCOS</span>
                    <span>Ovary has enlarged surface with multiple small 2-8mm unreleased follicles in ring pattern looks like a string of pearls. High male hormones arrest egg release.</span>
                  </li>
                  <li className="flex gap-1.5 items-start">
                    <span className="text-rose-600 font-bold">⭕ ENDOMETRIOSIS</span>
                    <span>Small reddish-brown dots or deep blue cysts growing on fallopian tube lining or vaginal outer walls, bleeding monthly into pelvic pelvic floor leading to inflammatory scarring.</span>
                  </li>
                  <li className="flex gap-1.5 items-start">
                    <span className="text-amber-800 font-bold">⭕ FIBROIDS</span>
                    <span>Large round muscular benign knots growing either inside uterus cavity (submucosal), within walls (intramural) or hanging outside uterus (subserosal), altering uterus shape and bleeding scale.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
