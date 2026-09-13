/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  User,
  Database,
  Settings
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout: () => void;
  userEmail: string;
  userRole?: 'Read Only' | 'Full Access';
}

export default function Navbar({ activeTab, setActiveTab, onLogout, userEmail, userRole = 'Full Access' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'expense', label: 'Expenses', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'income', label: 'Incomes', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ] as const;

  return (
    <>
      {/* Top Navbar for Mobile / Tablet */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 text-white p-4 sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 border border-slate-700/50">
            <img src="https://i.postimg.cc/Jzvd6JxM/loguf.png" alt="CARE ELEVATOR CENTER" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="font-black text-xs tracking-wider uppercase text-white">
              CARE ELEVATOR CENTER
            </h1>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block -mt-0.5">ACCOUNTS HUB</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen fixed left-0 top-0 bottom-0 p-6 z-30">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-inner border border-slate-700/50 overflow-hidden shrink-0">
            <img src="https://i.postimg.cc/Jzvd6JxM/loguf.png" alt="CARE ELEVATOR CENTER" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white tracking-wide leading-tight">
              CARE ELEVATOR CENTER
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">ACCOUNTS HUB</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all relative ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-slate-800 rounded-xl -z-10 border border-slate-700/50"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer/Meta Section of Sidebar */}
        <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-slate-400 truncate">
                {userRole === 'Read Only' ? 'READ-ONLY ACCESS' : 'FULL ACCESS'}
              </p>
              <p className="text-[10px] text-slate-500 truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu (Slide-In) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-slate-900 text-slate-300 p-6 z-50 flex flex-col shadow-2xl border-l border-slate-800"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1 border border-slate-700/50 overflow-hidden shrink-0">
                    <img src="https://i.postimg.cc/Jzvd6JxM/loguf.png" alt="CARE ELEVATOR CENTER" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h2 className="font-black text-xs text-white leading-tight">CARE ELEVATOR CENTER</h2>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">ACCOUNTS HUB</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold transition-all relative ${
                        isActive 
                          ? 'text-white bg-slate-800 border border-slate-700/50' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400">
                      {userRole === 'Read Only' ? 'READ-ONLY ACCESS' : 'FULL ACCESS'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
