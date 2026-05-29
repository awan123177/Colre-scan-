import React, { useState, useEffect, useRef } from "react";
import PhoneContainer from "./components/PhoneContainer";
import { PRESET_MEALS } from "./presets";
import { MealItem, CalorieGoal, ScanResult } from "./types";
import { 
  Camera, 
  Plus, 
  Trash2, 
  Utensils, 
  Check, 
  Sparkles, 
  Settings, 
  RotateCcw, 
  ChevronRight, 
  UploadCloud, 
  AlertCircle, 
  Flame, 
  Apple, 
  Award, 
  TrendingUp, 
  Info,
  Calendar,
  Layers,
  Sparkle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";

// Initial goals
const DEFAULT_CALORIE_GOAL: CalorieGoal = {
  calories: 2000,
  protein: 130, // in g
  carbs: 220,   // in g
  fats: 65,     // in g
};

// Helper: Calculate standard YYYY-MM-DD for seeds relative to current system time
const getRelativeDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

// Seed initial meal logs for realism
const SEED_MEAL_LOGS: MealItem[] = [
  // Today's entries (Date 0)
  {
    id: "seed-1",
    mealName: "Blueberry Almond Oatmeal",
    calories: 360,
    estimatedWeightGrams: 280,
    macros: { protein: 14, carbs: 54, fats: 10 },
    ingredients: ["Oats", "Fresh Blueberries", "Almond Butter", "Chia Seeds"],
    healthTip: "High-fiber breakfast keeps glucose levels stable for hours.",
    timestamp: "08:15 AM",
    mealType: "Breakfast",
    date: getRelativeDateString(0)
  },
  {
    id: "seed-2",
    mealName: "Zesty Mediterranean Salad",
    calories: 410,
    estimatedWeightGrams: 340,
    macros: { protein: 18, carbs: 22, fats: 28 },
    ingredients: ["Baby Spinach", "Greek Feta", "Kalamata Olives", "Cucumber", "Olive Oil Dressing"],
    healthTip: "Healthy olive fats boost fat-soluble vitamin absorption.",
    timestamp: "01:30 PM",
    mealType: "Lunch",
    date: getRelativeDateString(0)
  },
  // Yesterday's entries (1 day ago)
  {
    id: "seed-3",
    mealName: "Gourmet Pepperoni Pizza Slice",
    calories: 440,
    estimatedWeightGrams: 195,
    macros: { protein: 18, carbs: 54, fats: 16 },
    ingredients: ["Sourdough Base Crust", "Vine-ripened Tomato Sauce", "Part-Skim Mozzarella", "Dry-Cured Pepperoni"],
    healthTip: "Hearty energy replenishment.",
    timestamp: "07:45 PM",
    mealType: "Dinner",
    date: getRelativeDateString(1)
  },
  {
    id: "seed-4",
    mealName: "Superfood Avocado Salad",
    calories: 380,
    estimatedWeightGrams: 320,
    macros: { protein: 12, carbs: 18, fats: 32 },
    ingredients: ["Fresh Creamy Avocado", "Mixed Salad Greens", "Cherry Tomatoes", "Extra Virgin Olive Oil", "Pumpkin Seeds"],
    healthTip: "Full of heart-healthy monounsaturated fats.",
    timestamp: "01:10 PM",
    mealType: "Lunch",
    date: getRelativeDateString(1)
  },
  // 2 days ago
  {
    id: "seed-5",
    mealName: "Premium Rainbow Sushi Platter",
    calories: 595,
    estimatedWeightGrams: 350,
    macros: { protein: 32, carbs: 82, fats: 8 },
    ingredients: ["Sashimi Salmon", "Ahi Tuna", "Sushi Rice", "Ripe Hass Avocado", "Crispy Nori Wraps"],
    healthTip: "Excellent source of cognitive-boosting omega-3 fatty acids.",
    timestamp: "02:15 PM",
    mealType: "Lunch",
    date: getRelativeDateString(2)
  },
  {
    id: "seed-6",
    mealName: "Double Berry Protein Pancakes",
    calories: 460,
    estimatedWeightGrams: 280,
    macros: { protein: 18, carbs: 70, fats: 12 },
    ingredients: ["Rolled Oats", "Whey Protein Isolate", "Fresh Blueberries", "Organic Maple Syrup", "Bananas"],
    healthTip: "High-quality breakfast fuel with slow-release carbs.",
    timestamp: "08:30 AM",
    mealType: "Breakfast",
    date: getRelativeDateString(2)
  },
  // 3 days ago
  {
    id: "seed-7",
    mealName: "Grilled Chicken & Jasmine Brown Rice",
    calories: 580,
    estimatedWeightGrams: 420,
    macros: { protein: 48, carbs: 58, fats: 10 },
    ingredients: ["Marinated Chicken Breast", "Steamed Jasmine Rice", "Sautéed Fresh Broccoli Florets", "Olive Oil"],
    healthTip: "Lean high-protein meal built for optimal recovery.",
    timestamp: "01:25 PM",
    mealType: "Lunch",
    date: getRelativeDateString(3)
  },
  // 4 days ago
  {
    id: "seed-8",
    mealName: "Whey Yogurt & Honey Fruit Mix",
    calories: 280,
    estimatedWeightGrams: 200,
    macros: { protein: 20, carbs: 32, fats: 4 },
    ingredients: ["Greek Yogurt", "Organic Honey", "Walnuts"],
    healthTip: "Probiotics support outstanding digestive health.",
    timestamp: "04:10 PM",
    mealType: "Snack",
    date: getRelativeDateString(4)
  },
  // 5 days ago
  {
    id: "seed-9",
    mealName: "Beef Brisket Rice Bowl",
    calories: 720,
    estimatedWeightGrams: 450,
    macros: { protein: 40, carbs: 80, fats: 25 },
    ingredients: ["Shaved Beef Brisket", "White Rice", "Teriyaki Sauce"],
    healthTip: "Dense calorie booster built for physical stamina.",
    timestamp: "06:50 PM",
    mealType: "Dinner",
    date: getRelativeDateString(5)
  },
  // 6 days ago
  {
    id: "seed-10",
    mealName: "Whole Wheat Salmon Wrap",
    calories: 510,
    estimatedWeightGrams: 300,
    macros: { protein: 32, carbs: 45, fats: 18 },
    ingredients: ["Salmon Fillet", "Whole Wheat Wrap", "Greek Yogurt Sauce", "Spinach"],
    healthTip: "High mental performance and sustained energy.",
    timestamp: "01:05 PM",
    mealType: "Lunch",
    date: getRelativeDateString(6)
  }
];

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings" | "history">("dashboard");

  // Goals and history list state
  const [calorieGoal, setCalorieGoal] = useState<CalorieGoal>(() => {
    const saved = localStorage.getItem("calorie_goals");
    return saved ? JSON.parse(saved) : DEFAULT_CALORIE_GOAL;
  });

  const [mealLogs, setMealLogs] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem("calorie_meal_logs");
    return saved ? JSON.parse(saved) : SEED_MEAL_LOGS;
  });

  // Scanner Modal overlay toggles
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Lunch");

  // Inputs within scanner flow
  const [customMealHint, setCustomMealHint] = useState("");
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Quick inputs
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickMealName, setQuickMealName] = useState("");
  const [quickCalories, setQuickCalories] = useState<number | "">("");
  const [quickProtein, setQuickProtein] = useState<number | "">("");
  const [quickCarbs, setQuickCarbs] = useState<number | " font-medium">("");
  const [quickFats, setQuickFats] = useState<number | "">("");

  // Refs for custom inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State of simulated live camera frame
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Persist edits inside state
  useEffect(() => {
    localStorage.setItem("calorie_goals", JSON.stringify(calorieGoal));
  }, [calorieGoal]);

  useEffect(() => {
    localStorage.setItem("calorie_meal_logs", JSON.stringify(mealLogs));
  }, [mealLogs]);

  // Load API status check from backend
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(!!data.hasApiKey);
      })
      .catch((err) => {
        console.warn("Could not retrieve system API status:", err);
        setHasApiKey(false); // Default logic fallback
      });
  }, []);

  // Compute stats totals for Today only
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMeals = mealLogs.filter(m => m.date === todayStr || !m.date);

  const totalCalories = todayMeals.reduce((acc, cr) => acc + cr.calories, 0);
  const totalProtein = todayMeals.reduce((acc, cr) => acc + cr.macros.protein, 0);
  const totalCarbs = todayMeals.reduce((acc, cr) => acc + cr.macros.carbs, 0);
  const totalFats = todayMeals.reduce((acc, cr) => acc + cr.macros.fats, 0);

  const calRemaining = Math.max(0, calorieGoal.calories - totalCalories);
  const caloriePercent = Math.min(100, (totalCalories / calorieGoal.calories) * 100);

  // Dynamic 7-day array generator
  const getPast7Days = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
      days.push({
        dateStr,
        label: dayName,
        displayDate: d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      });
    }
    return days;
  };

  const barChartData = getPast7Days().map((day) => {
    const dayMeals = mealLogs.filter(
      (m) => m.date === day.dateStr || (!m.date && day.dateStr === todayStr)
    );
    const caloriesSum = dayMeals.reduce((sum, item) => sum + item.calories, 0);
    return {
      name: day.label,
      calories: caloriesSum,
      displayDate: day.displayDate,
      dateStr: day.dateStr,
    };
  });

  const formatLogDate = (dateStr?: string) => {
    if (!dateStr) return "Today";
    if (dateStr === todayStr) return "Today";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs font-sans">
          <p className="font-bold text-white mb-0.5">{payload[0].payload.displayDate}</p>
          <p className="font-mono text-emerald-400 font-extrabold">{payload[0].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  // Macros target percentages
  const proteinPercent = Math.min(100, (totalProtein / calorieGoal.protein) * 100);
  const carbsPercent = Math.min(100, (totalCarbs / calorieGoal.carbs) * 100);
  const fatsPercent = Math.min(100, (totalFats / calorieGoal.fats) * 100);

  // Helper: Open Mobile Simulated or Native Photo Capture
  const handlePhotoClick = () => {
    setIsScannerOpen(true);
    setScanResult(null);
    setScanError(null);
    setCustomPhotoBase64(null);
    setPhotoPreviewUrl(null);
    setCustomMealHint("");
    // Start with a clean slate
    setIsCameraActive(false);
  };

  // Helper URL converter
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle local file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    try {
      setIsAnalyzing(true);
      setScanError(null);

      // Store a temporary preview
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreviewUrl(previewUrl);

      const base64String = await convertFileToBase64(file);
      setCustomPhotoBase64(base64String);
      
      setIsAnalyzing(false);
    } catch (err: any) {
      console.error(err);
      setScanError("Failed to convert the selected file to acceptable image encoding.");
      setIsAnalyzing(false);
    }
  };

  // Turn on actual device webcam camera
  const startCameraWebcam = async () => {
    try {
      setIsCameraActive(true);
      setScanError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 480, height: 480 },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Webcam access declined or not supported. Loading simulation canvas.", err);
      // Fail gracefully - will prompt user to use presets or select mock photos
      setIsCameraActive(false);
      setScanError("Camera device block or unsupported iframe environment. Please select a preset meal picture snapshot or upload a file directly.");
    }
  };

  // Stop current active webcam streams safely
  const stopCameraWebcam = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture Base64 frame snapshot from webcam
  const captureWebcamFrame = () => {
    if (!videoRef.current) return;
    try {
      const canvas = cameraCanvasRef.current || document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 320);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCustomPhotoBase64(dataUrl);
        setPhotoPreviewUrl(dataUrl);
        stopCameraWebcam();
      }
    } catch (e) {
      console.error("Frame capture failed:", e);
      setScanError("Failed to capture image snapshot from stream.");
    }
  };

  // Trigger Preset Quick Snapshot Simulation
  const handleSelectPresetSimulation = async (preset: typeof PRESET_MEALS[0]) => {
    try {
      setIsAnalyzing(true);
      setScanError(null);
      setCustomMealHint(preset.name);
      setPhotoPreviewUrl(preset.image);

      // Simulate a small network loading interval matching visual requirements
      await new Promise(r => setTimeout(r, 600));

      // We will create metadata base64 or pass name directly to mock matching on backend
      // Let's create an elegant minimal mock base64 to satisfy API structure
      const mockCanvas = document.createElement("canvas");
      mockCanvas.width = 100;
      mockCanvas.height = 100;
      const ctx = mockCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#10b981"; // Emerald green representational block
        ctx.fillRect(0, 0, 100, 100);
      }
      const dataUrl = mockCanvas.toDataURL("image/jpeg");
      setCustomPhotoBase64(dataUrl);
      setIsAnalyzing(false);
    } catch (err) {
      setIsAnalyzing(false);
    }
  };

  // Fire analytical API endpoint containing image payload
  const handleAnalyzeUpload = async () => {
    if (!customPhotoBase64) {
      setScanError("Please capture/upload an image first or select one of the high-fidelity food snapshots.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setScanError(null);

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: customPhotoBase64,
          mealHint: customMealHint || undefined,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "CalorieScan cloud endpoints are currently processing high volumes. Please retry shortly.");
      }

      const parsedResult: ScanResult = await response.json();
      if (!parsedResult.success) {
        setScanError(`Recognizing failed: ${parsedResult.healthTip || "Could not identify distinct food elements in the picture. Try setting a clear Hint description!"}`);
      } else {
        setScanResult(parsedResult);
      }
    } catch (err: any) {
      console.error("Scanning process error:", err);
      setScanError(err.message || "Visual nutrient parsing failed. Verify connectivity or specify a search hint.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save the successfully estimated meal to User Logs
  const handleConfirmAndSaveLog = () => {
    if (!scanResult) return;

    const hour = new Date().getHours();
    const minStr = new Date().getMinutes().toString().padStart(2, "0");
    const label = hour >= 12 ? "PM" : "AM";
    const normalHr = hour % 12 || 12;

    const newLogItem: MealItem = {
      id: "scan-" + Date.now() + "-" + Math.floor(Math.random() * 9999),
      mealName: scanResult.mealName,
      calories: Math.max(0, scanResult.calories),
      estimatedWeightGrams: Math.max(1, scanResult.estimatedWeightGrams),
      macros: {
        protein: Math.max(0, scanResult.macros.protein),
        carbs: Math.max(0, scanResult.macros.carbs),
        fats: Math.max(0, scanResult.macros.fats),
      },
      ingredients: scanResult.ingredients,
      healthTip: scanResult.healthTip,
      imageUrl: photoPreviewUrl || undefined,
      timestamp: `${normalHr}:${minStr} ${label}`,
      mealType: selectedMealType,
      date: new Date().toISOString().split("T")[0]
    };

    setMealLogs([newLogItem, ...mealLogs]);
    setIsScannerOpen(false);
    setScanResult(null);
    setCustomPhotoBase64(null);
    setPhotoPreviewUrl(null);
    // Instant redirect to dashboard
    setActiveTab("dashboard");
  };

  // Quick Manual Adding Flow
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMealName) return;

    const hour = new Date().getHours();
    const minStr = new Date().getMinutes().toString().padStart(2, "0");
    const label = hour >= 12 ? "PM" : "AM";
    const normalHr = hour % 12 || 12;

    const manualItem: MealItem = {
      id: "manual-" + Date.now(),
      mealName: quickMealName,
      calories: Number(quickCalories) || 0,
      estimatedWeightGrams: 200,
      macros: {
        protein: Number(quickProtein) || 0,
        carbs: Number(quickCarbs) || 0,
        fats: Number(quickFats) || 0,
      },
      ingredients: ["User manual entry"],
      healthTip: "Manually registered snack log. Keep up the dynamic diet integrity!",
      timestamp: `${normalHr}:${minStr} ${label}`,
      mealType: "Snack",
      date: new Date().toISOString().split("T")[0]
    };

    setMealLogs([manualItem, ...mealLogs]);
    setIsQuickAddOpen(false);
    setQuickMealName("");
    setQuickCalories("");
    setQuickProtein("");
    setQuickCarbs("");
    setQuickFats("");
  };

  // Delete logged item
  const handleDeleteMeal = (id: string) => {
    setMealLogs(mealLogs.filter(item => item.id !== id));
  };

  // Reset demo logs
  const handleResetLogsToDefault = () => {
    if (window.confirm("Are you sure you want to clear your current today logs to restart fresh?")) {
      setMealLogs(SEED_MEAL_LOGS);
    }
  };

  return (
    <PhoneContainer activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* 
        MAIN VISUAL SCREENS ROUTER
      */}

      {activeTab === "dashboard" && (
        <div id="screen-dashboard" className="p-5 flex flex-col gap-5 animate-fade-in pb-10">
          
          {/* Header Top Branding */}
          <div id="dash-header" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-md">
                <Utensils size={18} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight">Calorie<span className="text-emerald-400">Scan</span></h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold">Today's Health Journal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* API Status Key marker badge */}
              <div 
                className={`text-[10px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-full border ${
                  hasApiKey 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
                title={hasApiKey ? "Gemini Live Vision AI ready" : "Local Nutrition Sandbox"}
              >
                {hasApiKey ? "🤖 Gemini Live" : "🧪 Emulator Sandbox"}
              </div>
            </div>
          </div>

          {/* Core Visual Progress Donut Card */}
          <div id="dash-hero-widget" className="relative overflow-hidden bg-slate-950/80 rounded-3xl p-6 border border-slate-800/60 shadow-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex flex-col items-center justify-center gap-5 mt-2">
              
              {/* Conditional Goal Reached UI Badge */}
              {totalCalories >= calorieGoal.calories && (
                <div 
                  id="dashboard-goal-reached-badge"
                  className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 animate-bounce"
                >
                  <Sparkles size={13} className="text-emerald-400 animate-pulse" />
                  <span>Goal Reached!</span>
                </div>
              )}
              
              {/* Circle Ring Tracker */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                
                {/* SVG Ring Path */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Live Progress Bar with gradient colors */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-emerald-400 transition-all duration-700 ease-out-sine"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - caloriePercent / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Central Text Readings */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <Flame className="w-5 h-5 text-emerald-400 mb-0.5 animate-pulse" />
                  <span id="hero-eaten-calories" className="text-3xl font-extrabold font-mono tracking-tight text-white leading-none">
                    {totalCalories}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">kcal consumed</span>
                  
                  <div className="mt-2 h-[1px] w-12 bg-slate-800" />
                  
                  <span className="text-xs font-semibold text-slate-300 mt-1.5 font-mono">
                    target: {calorieGoal.calories}
                  </span>
                </div>
              </div>

              {/* Goal Balance Highlights bar */}
              <div className="w-full grid grid-cols-2 bg-slate-900/40 divide-x divide-slate-800 border-t border-slate-800/80 pt-4 mt-2">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">Remaining</span>
                  <p className={`text-lg font-extrabold font-mono ${calRemaining === 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {calRemaining} <span className="text-xs font-semibold">kcal</span>
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">Budget Burned</span>
                  <p className="text-lg font-extrabold font-mono text-slate-200">
                    {caloriePercent.toFixed(0)}<span className="text-xs font-semibold">%</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Macronutrients Intake Panel */}
          <div id="dash-macros-widget" className="bg-slate-950/40 p-5 rounded-3xl border border-slate-800/70">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers size={14} className="text-emerald-400" />
                Macronutrient Balance
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Daily Goals Status</span>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Protein Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-200 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                    Protein (g)
                  </span>
                  <span className="font-mono text-slate-300">
                    <strong className="text-white">{totalProtein}g</strong> / {calorieGoal.protein}g
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500 ease-out"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] font-mono text-slate-500">
                  <span>Muscle rebuild target</span>
                  <span>{proteinPercent.toFixed(0)}% met</span>
                </div>
              </div>

              {/* Carbs Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-200 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    Carbohydrates (g)
                  </span>
                  <span className="font-mono text-slate-300">
                    <strong className="text-white">{totalCarbs}g</strong> / {calorieGoal.carbs}g
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] font-mono text-slate-500">
                  <span>Stamina & Energy focus</span>
                  <span>{carbsPercent.toFixed(0)}% met</span>
                </div>
              </div>

              {/* Fats Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-200 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                    Fats (g)
                  </span>
                  <span className="font-mono text-slate-300">
                    <strong className="text-white">{totalFats}g</strong> / {calorieGoal.fats}g
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500 ease-out"
                    style={{ width: `${fatsPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] font-mono text-slate-500">
                  <span>Hormone regulatory fats</span>
                  <span>{fatsPercent.toFixed(0)}% met</span>
                </div>
              </div>

            </div>
          </div>

          {/* Preset snapshots demo testing callout */}
          <div id="demo-presets-panel" className="bg-slate-900 border border-emerald-500/10 rounded-3xl p-4.5 block">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Sparkle size={18} className="animate-spin-slow" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-200">Fast Camera Simulators</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Want to test the AI instant nutrient scanner now? Tap the floating green camera scanner below, select a pre-made real-world food snapshot, and click scan! This represents high-fidelity camera captures.
                </p>
              </div>
            </div>
          </div>


          {/* Today's Meals Simple History Header */}
          <div id="dash-meals-sect" className="flex justify-between items-center mt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-400" />
              Logged Today ({todayMeals.length})
            </h3>
            <button 
              onClick={() => setActiveTab("history")}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold transition-all flex items-center gap-0.5 cursor-pointer"
            >
              See Log <ChevronRight size={14} />
            </button>
          </div>

          {/* Brief Meal Overview List */}
          {todayMeals.length === 0 ? (
            <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
              <Utensils className="mx-auto w-8 h-8 opacity-25 mb-2" />
              Your diet journal is clean.
              <br />
              Tap the 📷 scanner button to start tracking!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todayMeals.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800/80 flex items-center justify-between hover:bg-slate-950 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-800">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="Captured food item" />
                      ) : (
                        <span className="text-xs font-bold font-mono text-slate-600">
                          {item.mealType[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white transition-all max-w-[140px] truncate">{item.mealName}</h4>
                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono font-bold uppercase">{item.mealType}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        P: {item.macros.protein}g · C: {item.macros.carbs}g · F: {item.macros.fats}g
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-emerald-400 font-mono">
                        +{item.calories} <span className="text-[9px] text-slate-400 font-medium">kcal</span>
                      </p>
                      <p className="text-[8px] text-slate-500 font-mono">{item.timestamp}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteMeal(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              
              {todayMeals.length > 3 && (
                <button
                  onClick={() => setActiveTab("history")}
                  className="w-full py-2 bg-slate-950/30 hover:bg-slate-950/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400 hover:text-slate-200 transition-all font-semibold"
                >
                  View older entries (+{todayMeals.length - 3} more)
                </button>
              )}
            </div>
          )}

          {/* Quick manual log form switcher */}
          <div className="mt-2 text-center">
            <button 
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="text-[11px] text-slate-400 font-semibold hover:text-slate-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>{isQuickAddOpen ? "Hide Quick Manual Log" : "Add Meal Manually (No Image)"}</span>
              <Plus size={12} className={`transform transition-transform ${isQuickAddOpen ? 'rotate-45' : ''}`} />
            </button>
          </div>

          {isQuickAddOpen && (
            <form onSubmit={handleQuickAddSubmit} className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col gap-3 animate-fade-in">
              <h4 className="text-xs font-bold text-emerald-400">Quick Manual Calorie Addition</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Meal Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Snack Protein Whey Shake" 
                    value={quickMealName}
                    onChange={(e) => setQuickMealName(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Calories (kcal)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 240" 
                    required
                    value={quickCalories}
                    onChange={(e) => setQuickCalories(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Protein (g)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 20" 
                    value={quickProtein}
                    onChange={(e) => setQuickProtein(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Carbs (g)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 35" 
                    value={quickCarbs}
                    onChange={(e) => setQuickCarbs(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Fats (g)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 8" 
                    value={quickFats}
                    onChange={(e) => setQuickFats(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs text-white rounded-xl transition-all font-bold tracking-wide mt-1 cursor-pointer"
              >
                Log Meal Instantly
              </button>
            </form>
          )}

        </div>
      )}


      {activeTab === "history" && (
        <div id="screen-history" className="p-5 flex flex-col gap-5 animate-fade-in pb-10">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">System Intake Journal</h2>
              <p className="text-[10px] text-slate-400 font-mono">Calorie & Macro logs</p>
            </div>
            <button 
              onClick={handleResetLogsToDefault}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Logs</span>
            </button>
          </div>

          {/* Past 7 Days Caloric History Bar Chart */}
          <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" />
                  7-Day Calorie Intake
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Goal line at {calorieGoal.calories} kcal</p>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold font-mono tracking-wider">
                WEEKLY SUMMARY
              </span>
            </div>

            <div className="w-full h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, (dataMax: number) => Math.max(calorieGoal.calories + 400, dataMax + 200)]}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }} />
                  
                  {/* Goal limit reference line */}
                  <ReferenceLine 
                    y={calorieGoal.calories} 
                    stroke="#10b981" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.5}
                    opacity={0.7}
                  />

                  <Bar 
                    dataKey="calories" 
                    radius={[6, 6, 0, 0]}
                  >
                    {barChartData.map((entry, index) => {
                      const isToday = entry.dateStr === todayStr;
                      const isOverGoal = entry.calories > calorieGoal.calories;
                      
                      let barColor = "url(#barGradientNormal)";
                      if (isToday) {
                        barColor = "url(#barGradientToday)";
                      } else if (isOverGoal) {
                        barColor = "url(#barGradientOver)";
                      }

                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={barColor}
                        />
                      );
                    })}
                  </Bar>

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="barGradientToday" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="barGradientOver" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#be123c" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-mono border-t border-slate-900 pt-2.5 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Normal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
                Active Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Over Limit
              </span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Daily Macronutrient Load</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 block mb-0.5">Protein</span>
                <span className="text-base font-extrabold text-rose-400 font-mono">{totalProtein}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 block mb-0.5">Carbs</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">{totalCarbs}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 block mb-0.5">Fats</span>
                <span className="text-base font-extrabold text-teal-400 font-mono">{totalFats}g</span>
              </div>
            </div>
          </div>

          {mealLogs.length === 0 ? (
            <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
              <Utensils className="mx-auto w-10 h-10 opacity-25 mb-3" />
              Your food intake history is empty.
              <br />
              Log your meals on the main dashboard to see them mapped here.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {mealLogs.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 flex flex-col gap-2.5 relative font-sans"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt="Meal item context" />
                        ) : (
                          <span className="text-xs font-extrabold text-emerald-400 uppercase font-mono">{item.mealName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-white leading-tight max-w-[150px] truncate">{item.mealName}</h4>
                          <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono font-bold uppercase">{item.mealType}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">
                          Portion: ~{item.estimatedWeightGrams}g ({formatLogDate(item.date)} · {item.timestamp})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-emerald-400 font-mono tracking-tight leading-none">+{item.calories} <span className="text-[9px] text-slate-400 font-semibold font-sans">kcal</span></p>
                      </div>
                      <button 
                        onClick={() => handleDeleteMeal(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Macronutrients micro bar inside list */}
                  <div className="bg-slate-900 px-3 py-2 rounded-xl flex items-center justify-between text-[10px] border border-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Prot: <strong>{item.macros.protein}g</strong></span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Carb: <strong>{item.macros.carbs}g</strong></span>
                      <span className="text-slate-400 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Fats: <strong>{item.macros.fats}g</strong></span>
                    </div>
                  </div>

                  {/* Scientific visual feedback healthTip */}
                  {item.healthTip && (
                    <div className="text-[10px] text-slate-400 bg-emerald-500/5 px-3 py-2 border-l-2 border-emerald-500 rounded-r-lg italic mt-0.5">
                      " {item.healthTip} "
                    </div>
                  )}

                  {item.ingredients && item.ingredients.length > 0 && item.ingredients[0] !== "User manual entry" && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {item.ingredients.map((ing, i) => (
                        <span key={i} className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}


      {activeTab === "settings" && (
        <div id="screen-settings" className="p-5 flex flex-col gap-5 animate-fade-in pb-10">
          
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Daily Calorie Goals</h2>
            <p className="text-[10px] text-slate-400 font-mono">Tailor nutritional boundaries</p>
          </div>

          <div className="bg-emerald-500/5 p-4.5 rounded-3xl border border-emerald-500/10 block">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 select-none flex-shrink-0">
                <Award size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Balanced Calorie Calculators</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  CalorieScan maps scanned foods to these goal ratios. Tailor targets to support high athletic recovery levels or metabolic goals.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/80 flex flex-col gap-4">
            
            {/* Target energy calibration */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <label className="flex items-center gap-1">
                  <Flame size={14} className="text-emerald-400" />
                  Target Calories
                </label>
                <span className="font-mono text-emerald-400">{calorieGoal.calories} kcal</span>
              </div>
              <input 
                type="range" 
                min="1200" 
                max="4500" 
                step="50"
                value={calorieGoal.calories}
                onChange={(e) => setCalorieGoal({ ...calorieGoal, calories: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-ew-resize h-2"
              />
              <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                <span>1,200 (Cut)</span>
                <span>2,500 (Maintain)</span>
                <span>4,500 (Bulking)</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-800/80 my-1" />

            {/* Protein Target input range */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <label className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Protein Goal
                </label>
                <span className="font-mono text-rose-300">{calorieGoal.protein}g</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="250" 
                step="5"
                value={calorieGoal.protein}
                onChange={(e) => setCalorieGoal({ ...calorieGoal, protein: Number(e.target.value) })}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-ew-resize h-1.5"
              />
            </div>

            {/* Carbs Target input range */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <label className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Carbohydrates Goal
                </label>
                <span className="font-mono text-amber-300">{calorieGoal.carbs}g</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="5"
                value={calorieGoal.carbs}
                onChange={(e) => setCalorieGoal({ ...calorieGoal, carbs: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-ew-resize h-1.5"
              />
            </div>

            {/* Fats Target input range */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <label className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Fats Goal
                </label>
                <span className="font-mono text-teal-300">{calorieGoal.fats}g</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="150" 
                step="5"
                value={calorieGoal.fats}
                onChange={(e) => setCalorieGoal({ ...calorieGoal, fats: Number(e.target.value) })}
                className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-ew-resize h-1.5"
              />
            </div>

          </div>

          <div className="bg-slate-950 p-4.5 rounded-3xl border border-slate-800/80 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Preset Settings Cues</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setCalorieGoal({ calories: 1600, protein: 120, carbs: 160, fats: 50 })}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800/80 active:scale-95 border border-slate-800/50 rounded-2xl text-xs text-left transition-all cursor-pointer"
              >
                <span className="text-emerald-400 text-[10px] font-bold block mb-0.5">✂️ Fat Weight Cut</span>
                <span className="text-slate-200 block text-xs font-semibold font-mono">1,600 kcal</span>
              </button>

              <button 
                onClick={() => setCalorieGoal({ calories: 2800, protein: 180, carbs: 340, fats: 80 })}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800/80 active:scale-95 border border-slate-800/50 rounded-2xl text-xs text-left transition-all cursor-pointer"
              >
                <span className="text-yellow-400 text-[10px] font-bold block mb-0.5">💪 Athletic Gain</span>
                <span className="text-slate-200 block text-xs font-semibold font-mono">2,800 kcal</span>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-1">
              Select targets to automatically calibrate nutritional goals.
            </p>
          </div>

        </div>
      )}

      {/* 
        CAMERA / PHOTO UPLOAD OVERLAY SLIDE-UP MODAL
       */}
      {isScannerOpen && (
        <div id="scanner-modal" className="absolute inset-0 bg-slate-950/98 backdrop-blur z-50 flex flex-col animate-slide-up select-none">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-slate-950">
            <div className="flex items-center gap-2">
              <Camera className="text-emerald-400 w-5 h-5 animate-pulse" />
              <h2 className="text-sm font-bold tracking-tight">AI Food Scan Scanner</h2>
            </div>
            <button 
              onClick={() => {
                stopCameraWebcam();
                setIsScannerOpen(false);
              }}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-850 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            
            {/* Camera View / Preview Screen */}
            <div className="relative aspect-square w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-center text-center">
              
              {isCameraActive ? (
                /* Native Camera live video stream node */
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video 
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Digital crosshair scanning overlay */}
                  <div className="absolute inset-8 border border-emerald-500/25 pointer-events-none rounded-2xl">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-scan-beam" />
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider font-semibold uppercase bg-slate-950/80 px-2.5 py-1 rounded-full text-slate-200">
                    🔴 Camera Active Frame
                  </div>
                </div>
              ) : photoPreviewUrl ? (
                /* Captured framework display representation */
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                  <img src={photoPreviewUrl} alt="Meal snapshot" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 text-[9px] bg-slate-950/90 text-emerald-400 px-2 rounded-full py-0.5 border border-emerald-500/20 uppercase tracking-widest font-bold">
                    Picture Loaded
                  </div>
                  <button 
                    onClick={() => {
                      setPhotoPreviewUrl(null);
                      setCustomPhotoBase64(null);
                    }}
                    className="absolute bottom-4 right-4 text-[10px] bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow"
                  >
                    Clear Photo
                  </button>
                </div>
              ) : (
                /* Call to Actions placeholder state */
                <div className="p-6 flex flex-col items-center justify-center">
                  <UploadCloud size={44} className="text-slate-600 mb-3 animate-bounce" />
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Upload plate photo to calibrate</h3>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-[240px] mx-auto mb-4">
                    Upload an organic dish picture or choose from a simulated preset food snaps below.
                  </p>
                  
                  <div className="flex flex-col gap-2 w-full max-w-[200px]">
                    <button 
                      onClick={startCameraWebcam}
                      className="w-full py-2.5 bg-slate-955 text-white rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera size={14} className="text-emerald-400" />
                      Take Photo
                    </button>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 bg-slate-955 text-white rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud size={14} className="text-emerald-400" />
                      Pick from Gallery
                    </button>
                  </div>
                </div>
              )}

              {/* Invisible helper raw inputs */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <canvas ref={cameraCanvasRef} className="hidden" />
            </div>

            {/* Simulated Live Camera Controls Trigger */}
            {isCameraActive && (
              <button 
                onClick={captureWebcamFrame}
                className="w-full py-4 bg-emerald-500 text-slate-950 rounded-2xl text-xs font-bold font-sans hover:bg-emerald-400 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Camera size={18} />
                <span>Snap Picture Snapshot Now</span>
              </button>
            )}

            {/* Quick Presets snaps to fast-testing AI calculations */}
            {!photoPreviewUrl && !isCameraActive && (
              <div className="flex flex-col gap-2 bg-slate-950 p-4 rounded-3xl border border-slate-850">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block mb-1">🧪 Test Snapshot Presets</span>
                <div className="flex flex-col gap-2">
                  {PRESET_MEALS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPresetSimulation(preset)}
                      className="flex items-center justify-between p-2 bg-slate-900 rounded-xl hover:bg-slate-850 border border-slate-800/80 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-200 block group-hover:text-emerald-400 transition-colors">{preset.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono italic">P: {preset.protein}g · C: {preset.carbs}g · F: {preset.fats}g</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">{preset.calories} kcal</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meal contextual hint label box */}
            {photoPreviewUrl && !scanResult && (
              <div className="bg-slate-950 p-4 rounded-3xl border border-slate-850 gap-2.5 flex flex-col">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1">
                    Describe item style context (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Avocado Toast with Egg" 
                    value={customMealHint}
                    onChange={(e) => setCustomMealHint(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500/60"
                  />
                  <p className="text-[9px] text-slate-500 mt-1">
                    This provides dietary descriptors to support high-fidelity estimates.
                  </p>
                </div>

                <div className="h-[1.5px] bg-slate-850" />

                <button
                  onClick={handleAnalyzeUpload}
                  disabled={isAnalyzing}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-slate-950 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles size={14} className="animate-spin-slow" />
                  <span>Scan & Analyze Food Nutrient</span>
                </button>
              </div>
            )}

            {/* Error notifications */}
            {scanError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4 flex items-start gap-2.5 text-xs">
                <AlertCircle className="text-red-400 flex-shrink-0" size={16} />
                <div>
                  <h4 className="font-bold">Nutrition Scan Alert</h4>
                  <p className="opacity-90 leading-relaxed mt-0.5">{scanError}</p>
                </div>
              </div>
            )}

            {/* LOADING SPINNER VIEWPORT */}
            {isAnalyzing && (
              <div className="bg-slate-950/90 border border-slate-850 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 block">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-slate-800" />
                  <span className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin" />
                  <Sparkles className="text-emerald-400 animate-pulse" size={18} />
                </div>
                <div className="text-center">
                  <h4 className="text-xs font-bold text-white tracking-wide">CalorieScan AI Nutritionists Working...</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Analyzing ingredient layout, portion weights, and macronutrient ratios from image.
                  </p>
                </div>
              </div>
            )}

            {/* CORE SCAN OUTSIDE RESULT FRAMEWORK */}
            {scanResult && (
              <div id="scanner-result-panel" className="bg-slate-950 p-5 rounded-3xl border border-emerald-500/20 space-y-4 animate-fade-in">
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                    <div>
                      <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400">Dietician Review</h3>
                      <p className="text-base font-extrabold text-white">{scanResult.mealName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full font-bold">
                    ~{scanResult.estimatedWeightGrams}g Portion
                  </span>
                </div>

                {/* Score readings block */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider text-emerald-400 block mb-0.5 font-bold">CALORIES</span>
                    <span className="text-base font-extrabold text-white font-mono">{scanResult.calories}</span>
                    <span className="text-[8px] text-slate-500 block">kcal</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-850">
                    <span className="text-[8px] uppercase tracking-wider text-rose-400 block mb-0.5 font-bold">PROTEIN</span>
                    <span className="text-sm font-extrabold text-white font-mono">{scanResult.macros.protein}g</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-850">
                    <span className="text-[8px] uppercase tracking-wider text-amber-400 block mb-0.5 font-bold">CARBS</span>
                    <span className="text-sm font-extrabold text-white font-mono">{scanResult.macros.carbs}g</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-850">
                    <span className="text-[8px] uppercase tracking-wider text-teal-400 block mb-0.5 font-bold">FATS</span>
                    <span className="text-sm font-extrabold text-white font-mono">{scanResult.macros.fats}g</span>
                  </div>
                </div>

                {/* Ingredients list recognized from photo */}
                {scanResult.ingredients && scanResult.ingredients.length > 0 && (
                  <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850 text-xs">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">Identified Ingredients</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.ingredients.map((ing, i) => (
                        <span key={i} className="text-[9px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium select-none">
                          <Check size={10} className="text-emerald-400 flex-shrink-0" />
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coach healthy highlighted feedback tip */}
                {scanResult.healthTip && (
                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-xs leading-relaxed italic text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 inline-block mr-1.5 -mt-0.5" />
                    "{scanResult.healthTip}"
                  </div>
                )}

                {/* Choose Meal Period select tracker */}
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1.5">
                    Log to which segment?
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["Breakfast", "Lunch", "Dinner", "Snack"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className={`py-1.5 border text-[10px] font-bold rounded-xl text-center transition-all cursor-pointer ${
                          selectedMealType === type 
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold" 
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-slate-850" />

                <button
                  onClick={handleConfirmAndSaveLog}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold rounded-2xl text-xs tracking-wider uppercase text-center transition-all block cursor-pointer shadow-lg"
                >
                  Confirm & Log to Journal
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating scanner action trigger button - Center of visual phone tab navigation */}
      {activeTab === "dashboard" && (
        <button
          id="btn-trigger-scanner"
          onClick={handlePhotoClick}
          className="fixed bottom-24 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-90 text-slate-950 p-4 rounded-full shadow-[0_12px_24px_-4px_rgba(16,185,129,0.5)] border-2 border-slate-950/80 transition-all z-40 cursor-pointer animate-pulse-glow"
          title="Scan meal snapshot"
        >
          <Camera size={26} className="text-slate-950 stroke-[2.2]" />
        </button>
      )}

    </PhoneContainer>
  );
}
