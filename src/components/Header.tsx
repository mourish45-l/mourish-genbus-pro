import React from 'react';
import type { PortalMode, BusinessTab } from '../types';
import {
  Sun,
  Moon,
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
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200 bg-white/90 dark:bg-slate-950/90 border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-[1560px] mx-auto px-3 sm:px-4 xl:px-8 py-2.5 sm:py-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onSwitchPortal('business');
              onSelectBizTab('dashboard');
            }}
            className="flex items-center gap-2 group min-w-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <i className="bx bxs-component text-xl"></i>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent whitespace-nowrap">
              Mourish GenBus
            </span>
          </a>
          <span className="hidden 2xl:inline-block text-[11px] text-slate-400 font-mono whitespace-nowrap">ERP · CRM · Books</span>
        </div>

        {/* Full navigation is reserved for wide desktop; tablets use the scrollable touch bar. */}
        <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 overflow-x-auto text-xs font-semibold py-0.5 min-w-0">
          {portalMode === 'business' ? (
            navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectBizTab(tab.id)}
                className={`px-2.5 2xl:px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeBizTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Client Portal · Review estimates, approve proposals, and view invoices
            </span>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-semibold">
            <button
              onClick={() => onSwitchPortal('business')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${portalMode === 'business' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >Business</button>
            <button
              onClick={() => onSwitchPortal('customer')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${portalMode === 'customer' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >Client</button>
          </div>
          <button onClick={onToggleTheme} className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors" title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'} aria-label="Toggle Theme">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          {userEmail && (
            <button onClick={onSignOut} className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title={`Signed in as ${userEmail} - Click to Sign Out`}>
              <i className="bx bx-log-out text-sm"></i><span className="truncate max-w-[90px]">{userEmail.split('@')[0]}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
