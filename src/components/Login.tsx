import React, { useState } from "react";
import { motion } from "motion/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { GraduationCap, ShieldAlert, ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

interface LoginProps {
  onNavigate: (view: "home" | "login" | "dashboard") => void;
  onLoginSuccess: () => void;
}

export default function Login({ onNavigate, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = "Login failed. Please verify your credentials.";
      if (err.code === "auth/user-not-found") msg = "No admin account found with this email.";
      else if (err.code === "auth/wrong-password") msg = "Incorrect password. Please try again.";
      else if (err.code === "auth/invalid-credential") msg = "Invalid login credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a1128] via-[#0d1e35] to-[#122e54] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic starscape/particles inside the background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-2 h-2 rounded-full bg-white top-12 left-1/4 animate-pulse" />
        <div className="absolute w-3 h-3 rounded-full bg-yellow-200 top-1/3 right-1/4 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-300 bottom-1/4 left-1/3 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="circle absolute w-96 h-96 rounded-full bg-sky-500/10 -top-24 -left-20 blur-3xl" />
        <div className="circle absolute w-80 h-80 rounded-full bg-pink-500/5 bottom-12 -right-12 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <button 
          onClick={() => onNavigate("home")} 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm font-bold font-display cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to School Website
        </button>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Logo Heading container */}
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#ff6b6b] to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-black/10 mb-4 animate-float hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-black font-display tracking-tight text-white mb-1">
              Sri Chaithanya
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-[#ffd43b] uppercase mb-1">
              English Medium School
            </p>
            <p className="text-xs text-slate-400 font-bold font-display uppercase tracking-wider">
              Garladinne · Anantapur · Admin Portal
            </p>
          </div>

          {/* Feedback alerts container */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/15 border border-red-500/30 text-rose-200 p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs font-semibold"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs font-semibold"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-slate-300 mb-2 font-display">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="principal@srichaithanya.in" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 outline-none focus:border-[#ffd43b] focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black tracking-wider uppercase text-slate-300 font-display">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 outline-none focus:border-[#ffd43b] focus:bg-white/10 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-amber-400 to-[#ffd43b] hover:from-amber-300 hover:to-amber-400 text-slate-900 font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider text-xs cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
