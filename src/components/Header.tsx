import React from 'react';
import type { PortalMode, BusinessTab } from '../types';
import {
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  FileText,
  Receipt,
  Truck,
  Target,
  HardHat,
  Users,
  MessageSquare,
  Settings,
  Shield,
  LayoutDashboard,
} from 'lucide-react';

interface Props {
  portalMode: PortalMode;
  onSwitchPortal: (mode: PortalMode) => void;
  activeBizTab: BusinessTab;
  onSelectBizTab: (tab: BusinessTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userEmail: string | null;
  onSignOut: () => void;
}

export const Header: React.FC<Props> = ({
  portalMode,
  onSwitchPortal,
  activeBizTab,
  onSelectBizTab,
  isDark,
  onToggleTheme,
  userEmail,
  onSignOut,
}) => {
  const navTabs: { id: BusinessTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'quotations', label: 'Quotes', icon: <FileText className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
    { id: 'deliveries', label: 'Deliveries', icon: <Truck className="w-4 h-4" /> },
    { id: 'deals', label: 'Deals', icon: <Target className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <HardHat className="w-4 h-4" /> },
    { id: 'customers', label: 'CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'firebase_rules', label: 'Rules', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 px-4 lg:px-8 py-3 border-b backdrop-blur-xl transition-colors duration-200 bg-white/80 dark:bg-slate-950/80 border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchPortal('business');
              onSelectBizTab('dashboard');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <i className="bx bxs-component text-xl"></i>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent whitespace-nowrap">
              Mourish GenBus
            </span>
          </a>

          <span className="hidden xl:inline-block text-[11px] text-slate-400 font-mono">
            ERP · CRM · Books
          </span>
        </div>

        {/* Zone 2: Navigation Links (Zoho Production Suite Architecture) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto text-xs font-semibold py-0.5">
          {portalMode === 'business' ? (
            navTabs.map((tab) => {
              const isActive = activeBizTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectBizTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Free Hospital Client Self-Service Portal · Review Estimates, Approve Proposals, View Invoices
            </span>
          )}
        </nav>

        {/* Zone 3: Mode Switcher, Theme & User */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onSwitchPortal('business')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                portalMode === 'business'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Business ERP
            </button>
            <button
              onClick={() => onSwitchPortal('customer')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                portalMode === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Client Portal
            </button>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Sign Out / User identifier */}
          {userEmail && (
            <button
              onClick={onSignOut}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title={`Signed in as ${userEmail} - Click to Sign Out`}
            >
              <i className="bx bx-log-out text-sm"></i>
              <span className="truncate max-w-[90px]">{userEmail.split('@')[0]}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
