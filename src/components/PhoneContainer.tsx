import React, { useState, useEffect } from "react";
import { Wifi, Signal, Battery, Home, Settings, Smartphone, Monitor } from "lucide-react";

interface PhoneContainerProps {
  children: React.ReactNode;
  activeTab: "dashboard" | "settings" | "history";
  setActiveTab: (tab: "dashboard" | "settings" | "history") => void;
}

export default function PhoneContainer({
  children,
  activeTab,
  setActiveTab,
}: PhoneContainerProps) {
  const [deviceTime, setDeviceTime] = useState("");
  const [simulatedBattery, setSimulatedBattery] = useState(88);
  const [usePhoneShell, setUsePhoneShell] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setDeviceTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Slowly discharge battery sometimes just for a dynamic realism effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedBattery((prev) => (prev > 5 ? prev - 1 : 100));
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="calorie-scan-root" className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Simulation Selector Toolbar */}
      <div id="sim-toolbar" className="mb-4 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/50 flex items-center gap-3 text-xs shadow-xl z-20">
        <span className="text-slate-400 font-medium">Layout Shell:</span>
        <button
          id="btn-shell-on"
          onClick={() => setUsePhoneShell(true)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
            usePhoneShell
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Smartphone size={13} />
          <span>Mobile Phone</span>
        </button>
        <button
          id="btn-shell-off"
          onClick={() => setUsePhoneShell(false)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
            !usePhoneShell
              ? "bg-emerald-600 text-white shadow"
              : "text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Monitor size={13} />
          <span>Full Canvas</span>
        </button>
      </div>

      {usePhoneShell ? (
        /* Matte Physical Phone Silhouette Wrapper */
        <div
          id="phone-wrapper"
          className="relative w-full max-w-[390px] h-[820px] bg-slate-950 rounded-[50px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[3px] border-slate-800 flex flex-col overflow-hidden transition-all duration-300"
        >
          {/* Edge physical bezel button mock cues */}
          <div id="bezel-btn-vol-up" className="absolute left-[-2px] top-[140px] w-1.5 h-12 bg-slate-800 rounded-l-md" />
          <div id="bezel-btn-vol-down" className="absolute left-[-2px] top-[200px] w-1.5 h-12 bg-slate-800 rounded-l-md" />
          <div id="bezel-btn-power" className="absolute right-[-2px] top-[160px] w-1.5 h-16 bg-slate-800 rounded-r-md" />

          {/* Core Rounded Mobile Content Canvas */}
          <div
            id="phone-screen"
            className="flex-1 w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-800/80"
          >
            {/* Top Device Status Bar */}
            <div id="phone-status-bar" className="h-11 bg-slate-950 px-6 flex items-center justify-between z-30 select-none text-[12px] font-semibold text-slate-100 flex-shrink-0">
              <span id="statusBar-time" className="font-mono tracking-tight">{deviceTime || "12:00 PM"}</span>
              
              {/* iPhone Style Top Notch (Dynamic Island) */}
              <div id="statusBar-island" className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[100px] h-[24px] bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
                {/* Left lens dot */}
                <span className="w-2.5 h-2.5 bg-sky-950 border border-sky-900/40 rounded-full inline-block" />
                {/* Right sensor pulse */}
                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full inline-block" />
              </div>

              <div id="statusBar-icons" className="flex items-center gap-1.5 text-slate-200">
                <Signal size={12} className="stroke-[2.5]" />
                <Wifi size={12} className="stroke-[2.5]" />
                <div className="flex items-center gap-1 ml-0.5">
                  <span className="text-[10px] font-mono">{simulatedBattery}%</span>
                  <Battery size={14} className="stroke-[2] text-emerald-400 fill-emerald-400/20" />
                </div>
              </div>
            </div>

            {/* Simulated Active Application Viewport */}
            <div id="phone-content" className="flex-1 w-full overflow-y-auto bg-slate-900 flex flex-col relative">
              {children}
            </div>

            {/* Bottom Floating Navigation Bar - Phone Shell version */}
            <div
              id="phone-nav-bar"
              className="h-16 bg-slate-950/95 backdrop-blur border-t border-slate-800/80 px-6 flex items-center justify-around z-30 flex-shrink-0"
            >
              <button
                id="phone-tab-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                  activeTab === "dashboard"
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Home size={20} className={activeTab === "dashboard" ? "scale-110" : ""} />
                <span className="text-[10px] font-semibold tracking-wide">Journal</span>
              </button>

              <button
                id="phone-tab-history"
                onClick={() => setActiveTab("history")}
                className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                  activeTab === "history"
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smartphone size={20} className={activeTab === "history" ? "scale-110" : ""} />
                <span className="text-[10px] font-semibold tracking-wide">Scans Log</span>
              </button>

              <button
                id="phone-tab-settings"
                onClick={() => setActiveTab("settings")}
                className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                  activeTab === "settings"
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Settings size={20} className={activeTab === "settings" ? "scale-110" : ""} />
                <span className="text-[10px] font-semibold tracking-wide">Goals</span>
              </button>
            </div>

            {/* Interactive iOS pill bar */}
            <div id="phone-pill-bar" className="h-5 bg-slate-950 flex items-center justify-center pb-2.5 flex-shrink-0 select-none">
              <span className="w-32 h-1 bg-slate-700/80 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop Browser layout fallback */
        <div
          id="browser-panel"
          className="w-full max-w-lg bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[780px]"
        >
          {/* Simulated app header */}
          <div id="browser-bar" className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-sm font-semibold text-slate-400 font-mono tracking-wider text-center">
              CALORIESCAN EMULATOR v2.2
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              🔋 On Charge
            </div>
          </div>

          <div id="browser-content" className="flex-grow overflow-y-auto bg-slate-900 flex flex-col relative">
            {children}
          </div>

          {/* Bottom Navigation for Full Screen version */}
          <div
            id="browser-nav-bar"
            className="h-16 bg-slate-950 border-t border-slate-800 px-8 flex items-center justify-around z-30 flex-shrink-0"
          >
            <button
              id="browser-tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Home size={18} />
              <span className="text-xs font-semibold">Today's Journal</span>
            </button>

            <button
              id="browser-tab-history"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone size={18} />
              <span className="text-xs font-semibold">History Scans</span>
            </button>

            <button
              id="browser-tab-settings"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Settings size={18} />
              <span className="text-xs font-semibold">Calorie Goals</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
