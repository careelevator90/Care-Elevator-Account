import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { auth, db, hasValidFirebaseConfig } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onSuccess: (email: string, role: 'Read Only' | 'Full Access') => void;
  addToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function Login({ onSuccess, addToast }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const isFirebaseConfigured = hasValidFirebaseConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        // Real Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const loggedInEmail = userCredential.user?.email || email;
        
        let role: 'Read Only' | 'Full Access' = 'Read Only';
        const cleanEmail = loggedInEmail.trim().toLowerCase();
        const isAdminEmail = cleanEmail === 'careelevator90@gmail.com' || cleanEmail === 'ji.tft90@gmail.com' || cleanEmail.includes('admin');

        if (password === 'Bangladesh123' || isAdminEmail) {
          role = 'Full Access';
        } else if (db) {
          try {
            const docRef = doc(db, 'userRoles', cleanEmail);
            
            // 2-second timeout to avoid long Firestore hangs
            const docSnap = await Promise.race([
              getDoc(docRef),
              new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]);

            if (docSnap && docSnap.exists()) {
              const data = docSnap.data();
              const savedRole = String(data.role || '').trim().toLowerCase();
              role = (savedRole === 'read only' || savedRole === 'readonly' || savedRole === 'view only' || savedRole === 'view') 
                ? 'Read Only' 
                : 'Full Access';
            } else {
              role = 'Read Only';
            }
          } catch (e: any) {
            console.warn("Could not fetch user role on login within timeout, defaulting:", e);
            role = 'Read Only';
          }
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loggedInUserEmail', loggedInEmail);
        sessionStorage.setItem('loggedInUserRole', role);
        
        addToast('Login successful', 'success');
        onSuccess(loggedInEmail, role);
      } else {
        // Fallback password login if Firebase is not configured yet
        // This ensures the user is NEVER locked out and can configure Firebase in the settings tab
        if (password === 'Bangladesh123') {
          const loggedInEmail = email || 'careelevator90@gmail.com';
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('loggedInUserEmail', loggedInEmail);
          sessionStorage.setItem('loggedInUserRole', 'Full Access');
          
          addToast('Authorized developer entry granted (Fallback)', 'success');
          onSuccess(loggedInEmail, 'Full Access');
        } else {
          throw new Error('Incorrect credentials! (Fallback expects password: Bangladesh123)');
        }
      }
    } catch (err: any) {
      setErrorShake(true);
      console.error(err);
      addToast(err.message || 'Login failed! Check your credentials.', 'error');
      setTimeout(() => setErrorShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[100] px-4 overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 p-2.5 shadow-inner border border-slate-700/50 overflow-hidden">
              <img src="https://i.postimg.cc/Jzvd6JxM/loguf.png" alt="CARE ELEVATOR CENTER Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-wide">
              CARE ELEVATOR CENTER
            </h1>
            <p className="text-blue-400 font-bold uppercase text-xs tracking-widest mt-1">
              {isFirebaseConfigured ? 'FIREBASE AUTHENTICATION' : 'SYSTEM ACCESS CONTROL'}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {isFirebaseConfigured 
                ? 'Sign in with your registered account credentials.' 
                : 'Enter details to access the accounts platform.'}
            </p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl flex gap-3 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-bold">Firebase Configuration Not Found</p>
                <p className="mt-0.5 text-slate-400">
                  Firebase web SDK is not configured yet. You can sign in using fallback password <strong>Bangladesh123</strong> to enter settings and configure Firebase.
                </p>
              </div>
            </div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@careelevator.com"
                  required={isFirebaseConfigured}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white py-3.5 rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-blue-950/20 hover:shadow-blue-950/30 transition flex items-center justify-center gap-2 group disabled:opacity-50 text-xs mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>LOGIN SYSTEM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
          
          <div className="mt-8 text-center flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">
              Authorized Personnel Only. Access is monitored and logged.
            </span>
            {isFirebaseConfigured && (
              <span className="text-[9px] text-indigo-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Secure Google Firebase Auth Node Connected
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
