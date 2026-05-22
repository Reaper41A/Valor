import { useState } from "react";
import { TRIAGE_FLOW } from "../data";
import { TriageSeverity, TriageStep } from "../types";
import { AlertTriangle, ShieldCheck, HeartPulse, RefreshCw, ChevronRight, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SymptomTriageWizardProps {
  onSelectClinicTab: () => void;
}

export default function SymptomTriageWizard({ onSelectClinicTab }: SymptomTriageWizardProps) {
  const [selectedBranch, setSelectedBranch] = useState<"fever" | "diarrhea" | "cough" | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<TriageSeverity | "idle">("idle");

  const startTriage = (branch: "fever" | "diarrhea" | "cough") => {
    setSelectedBranch(branch);
    setHistory([]);
    setOutcome("idle");
    if (branch === "fever") {
      setCurrentNodeId("peds_fever_start");
    } else if (branch === "diarrhea") {
      setCurrentNodeId("diarrhea_start");
    } else {
      setCurrentNodeId("resp_start");
    }
  };

  const handleAnswer = (answer: "yes" | "no") => {
    if (!currentNodeId) return;
    const currentStep = TRIAGE_FLOW[currentNodeId];
    if (!currentStep) return;

    const nextNode = answer === "yes" ? currentStep.yesNext : currentStep.noNext;
    setHistory((prev) => [...prev, currentNodeId]);

    if (nextNode === "red" || nextNode === "yellow" || nextNode === "green") {
      setOutcome(nextNode as TriageSeverity);
      setCurrentNodeId(null);
    } else {
      setCurrentNodeId(nextNode);
    }
  };

  const handleBack = () => {
    if (history.length === 0) {
      resetTriage();
      return;
    }
    const previous = history[history.length - 1];
    setCurrentNodeId(previous);
    setHistory((prev) => prev.slice(0, -1));
    setOutcome("idle");
  };

  const resetTriage = () => {
    setSelectedBranch(null);
    setCurrentNodeId(null);
    setHistory([]);
    setOutcome("idle");
  };

  const getCurrentStep = (): TriageStep | null => {
    if (!currentNodeId) return null;
    return TRIAGE_FLOW[currentNodeId] || null;
  };

  const getSeverityHeading = (sev: TriageSeverity) => {
    switch (sev) {
      case "red":
        return "RED ALERT: Immediate Hospital Care Required";
      case "yellow":
        return "YELLOW CAUTION: Clinic Consultation Recommended";
      case "green":
        return "GREEN: Safe to Manage at Home, Monitor Closely";
      default:
        return "";
    }
  };

  const getSeverityDescription = (sev: TriageSeverity) => {
    switch (sev) {
      case "red":
        return "The symptoms entered show high-risk clinical danger signals (such as trouble breathing, infant high fever, convulsions, severe dehydration signs, or persistent vomiting). Any delay in care puts life in danger.";
      case "yellow":
        return "The patient presents symptoms that should be diagnosed and tested by a health professional at the dispensary (for Malaria rapid test, chest evaluation, dysentery treatment, or antibiotics).";
      case "green":
        return "There are currently no high-risk emergency markers detected. You can safely implement comforting home supportive therapy, hydration, and nutritional care. Always re-evaluate if symptoms worsen!";
    }
  };

  const getSeverityRemedies = (sev: TriageSeverity) => {
    switch (sev) {
      case "red":
        return [
          "Do not give any bulky solid food. If baby is breastfeeding, continue to offer small frequent feeds on the go.",
          "Prepare fresh Oral Rehydration Salts (ORS) water and carry it for the journey to prevent fatal shock.",
          "If the child has a high fever, dress them in thin light clothes and apply a cloth wet with lukewarm water on the head/neck. Do not freeze the body.",
          "Go directly to the nearest major Health Center or Referral Hospital. Do not wait for standard hours.",
        ];
      case "yellow":
        return [
          "Visit the nearest Community Dispensary or Primary Health Post within 24 hours.",
          "Get a Rapid Diagnostic Test (RDT) for Malaria if fever is present.",
          "Offer homemade ORS (1 liter clean water + 6 level teaspoons sugar + half teaspoon salt) to stabilize hydration.",
          "Keep feeding light soft foods and fluids. Monitor temperature every 4 hours.",
        ];
      case "green":
        return [
          "Continue exclusive breastfeeding frequently if baby is under 6 months.",
          "For cold/mild cough: Keep room ventilated. Offer steam inhalation cleanly using hot water (supervised). No antibiotics are needed for cold virus.",
          "For general physical weakness with low fever: Give baby paracetamol syrup strictly by weight scale if fretful.",
          "Sterilize drinking water by boiling thoroughly, or add bleach.",
          "Pinch tummy skin and check eyes daily to make sure dehydration doesn't develop.",
        ];
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm max-w-4xl mx-auto my-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
          <HeartPulse className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Offline Symptoms Triage Workbook</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step diagnostic questionnaire checklist. Designed to act as an offline-safe primary health filter.
          </p>
        </div>
      </div>

      {!selectedBranch ? (
        <div>
          <p className="text-xs text-slate-600 mb-4 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
            Please choose the symptom type below. This interactive check computes branching logic entirely inside your browser (0 bytes internet used) to identify danger signals and direct you to safe interventions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              id="triage-branch-fever"
              onClick={() => startTriage("fever")}
              className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 text-center hover:shadow-xs transition duration-150 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3 group-hover:scale-110 transition duration-150">
                <span className="text-xl">🌡️</span>
              </div>
              <span className="text-xs font-bold text-slate-900">Child Fever / Malaria Check</span>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                Fits, fever, drowsiness, feeding refusals, or rapid breathing in babies.
              </p>
            </button>

            <button
              id="triage-branch-diarrhea"
              onClick={() => startTriage("diarrhea")}
              className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 text-center hover:shadow-xs transition duration-150 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition duration-150">
                <span className="text-xl">💧</span>
              </div>
              <span className="text-xs font-bold text-slate-900">Diarrhea & Dehydration Check</span>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                Frequent watery stools, cholera suspicion, sunken eyes, or vomiting.
              </p>
            </button>

            <button
              id="triage-branch-cough"
              onClick={() => startTriage("cough")}
              className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 text-center hover:shadow-xs transition duration-150 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-3 group-hover:scale-110 transition duration-150">
                <span className="text-xl">🫁</span>
              </div>
              <span className="text-xs font-bold text-slate-900">Cough & Respiratory Check</span>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                Fast breathing, gasping, grunting, chest drawing, or long-standing cough.
              </p>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          {/* Header Progress bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs font-semibold text-slate-500">
            <span>
              Category:{" "}
              <b className="text-slate-800 capitalize">
                {selectedBranch === "fever" ? "🌡️ Pediatric Fever" : selectedBranch === "diarrhea" ? "💧 Diarrhea" : "🫁 Cough & Breathing"}
              </b>
            </span>
            <span>Step {history.length + 1}</span>
          </div>

          <AnimatePresence mode="wait">
            {outcome === "idle" && getCurrentStep() ? (
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="py-3"
              >
                <h3 className="text-sm font-semibold text-slate-800 leading-relaxed mb-6">
                  {getCurrentStep()?.question}
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    id="triage-btn-yes"
                    onClick={() => handleAnswer("yes")}
                    className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 active:scale-98 transition duration-100 cursor-pointer"
                  >
                    Yes (True)
                  </button>
                  <button
                    id="triage-btn-no"
                    onClick={() => handleAnswer("no")}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs hover:bg-slate-200 hover:text-slate-900 active:scale-98 transition duration-100 cursor-pointer"
                  >
                    No (False)
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <button
                    id="triage-btn-back"
                    onClick={handleBack}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-850 flex items-center gap-1 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    id="triage-btn-restart"
                    onClick={resetTriage}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Restart Triage
                  </button>
                </div>
              </motion.div>
            ) : null}

            {outcome !== "idle" ? (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-2"
              >
                {/* Result header */}
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border-2 mb-6 ${
                    outcome === "red"
                      ? "bg-rose-50/70 border-rose-200 text-rose-800"
                      : outcome === "yellow"
                      ? "bg-amber-50/70 border-amber-200 text-amber-800"
                      : "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      outcome === "red"
                        ? "bg-rose-100 text-rose-700"
                        : outcome === "yellow"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {outcome === "red" ? (
                      <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-bounce" />
                    ) : outcome === "yellow" ? (
                      <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{getSeverityHeading(outcome)}</h3>
                    <p className="text-[11px] opacity-90 leading-relaxed mt-1">{getSeverityDescription(outcome)}</p>
                  </div>
                </div>

                {/* Patient Stabilization Actions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 mb-6">
                  <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase mb-3 flex items-center gap-1">
                    <span>📋 Quick Action Steps (Low Bandwidth Safe)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {getSeverityRemedies(outcome).map((remedy, i) => (
                      <li key={i} className="flex gap-2.5 items-start">
                        <span className="inline-flex w-4 h-4 items-center justify-center rounded bg-slate-200 font-bold text-[10px] text-slate-700 flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation suggestions */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100 pt-4 mt-6">
                  <button
                    id="outcome-btn-restart"
                    onClick={resetTriage}
                    className="flex items-center gap-2 bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Start New Diagnosis
                  </button>

                  {outcome !== "green" && (
                    <button
                      id="outcome-btn-clinics"
                      onClick={onSelectClinicTab}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 border border-indigo-200 hover:border-indigo-300 bg-white py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Find Nearby Clinics
                    </button>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
