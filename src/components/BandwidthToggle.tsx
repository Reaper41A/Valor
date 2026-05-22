import { BandwidthMode } from "../types";

interface BandwidthToggleProps {
  currentMode: BandwidthMode;
  onModeChange: (mode: BandwidthMode) => void;
}

export default function BandwidthToggle({
  currentMode,
  onModeChange,
}: BandwidthToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-150 border border-slate-200 rounded-2xl p-1 shadow-2xs">
      {/* Real-time Signal Strength Meter & Availability details */}
      <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-100 rounded-xl">
        {/* Dynamic visual signal bars (filled or dimmed) */}
        <div className="flex items-end gap-[2px] h-3.5 w-4.5 mb-[1px]">
          <div
            className={`w-[3px] rounded-xs transition-colors duration-300 ${
              currentMode === "standard"
                ? "h-1.5 bg-emerald-500"
                : currentMode === "low-bandwidth"
                ? "h-1.5 bg-amber-500"
                : "h-1.5 bg-slate-200"
            }`}
          />
          <div
            className={`w-[3px] rounded-xs transition-colors duration-300 ${
              currentMode === "standard"
                ? "h-2.5 bg-emerald-500"
                : currentMode === "low-bandwidth"
                ? "h-2.5 bg-amber-500"
                : "h-2.5 bg-slate-200"
            }`}
          />
          <div
            className={`w-[3px] rounded-xs transition-colors duration-300 ${
              currentMode === "standard"
                ? "h-3.5 bg-emerald-500"
                : "h-3.5 bg-slate-200"
            }`}
          />
        </div>

        {/* Status text label representing availability protocol */}
        <div className="text-[9px] leading-3 font-black flex flex-col justify-center">
          {currentMode === "standard" && (
            <>
              <span className="text-emerald-700 uppercase tracking-wider">Connected</span>
              <span className="text-slate-400 font-bold">3G/4G Network</span>
            </>
          )}
          {currentMode === "low-bandwidth" && (
            <>
              <span className="text-amber-700 uppercase tracking-wider">Data-Saver</span>
              <span className="text-slate-400 font-bold">2G Network</span>
            </>
          )}
          {currentMode === "offline" && (
            <>
              <span className="text-rose-700 uppercase tracking-wider">Isolated</span>
              <span className="text-slate-400 font-bold">0 KB Cache On</span>
            </>
          )}
        </div>
      </div>

      {/* Segments allowing direct instant switches */}
      <div className="flex items-center">
        <button
          id="btn-switch-online-std"
          title="Switch to online standard 3G/4G mode"
          onClick={() => onModeChange("standard")}
          className={`px-2 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all duration-150 uppercase cursor-pointer ${
            currentMode === "standard"
              ? "bg-slate-900 text-white shadow-3xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Online
        </button>
        <button
          id="btn-switch-online-saver"
          title="Switch to 2G data saver mode"
          onClick={() => onModeChange("low-bandwidth")}
          className={`px-2 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all duration-150 uppercase cursor-pointer ${
            currentMode === "low-bandwidth"
              ? "bg-amber-500 text-white shadow-3xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Saver
        </button>
        <button
          id="btn-switch-offline"
          title="Force fully offline cache mode"
          onClick={() => onModeChange("offline")}
          className={`px-2 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all duration-150 uppercase cursor-pointer ${
            currentMode === "offline"
              ? "bg-rose-600 text-white shadow-3xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Offline
        </button>
      </div>
    </div>
  );
}
