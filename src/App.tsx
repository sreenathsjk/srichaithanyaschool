import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState<"home" | "login" | "dashboard">("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView("dashboard");
      } else {
        // Only kick back to home if they are currently on dashboard
        setView((prev) => (prev === "dashboard" ? "home" : prev));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#ff6b6b] to-amber-400 flex items-center justify-center text-white animate-spin mb-4 font-black">
          SC
        </div>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">
          Loading Sri Chaithanya School Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {view === "home" && <Home onNavigate={setView} />}
      {view === "login" && (
        <Login 
          onNavigate={setView} 
          onLoginSuccess={() => setView("dashboard")} 
        />
      )}
      {view === "dashboard" && <Dashboard onNavigate={setView} />}
    </div>
  );
}
