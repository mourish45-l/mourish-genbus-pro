import React from 'react';
import type { BusinessTab, PortalMode } from '../types';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Truck,
  Target,
  HardHat,
  Users,
  MessageSquare,
  Settings,
  UserCheck,
  ArrowLeft,
  Building2,
} from 'lucide-react';

interface Props {
  portalMode: PortalMode;
  onSwitchPortal: (mode: PortalMode) => void;
  activeBizTab: BusinessTab;
  onSelectBizTab: (tab: BusinessTab) => void;
}

export const MobileTouchBar: React.FC<Props> = ({
  portalMode,
  onSwitchPortal,
  activeBizTab,
  onSelectBizTab,
}) => {
  const quickTabs: { id: BusinessTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'quotations', label: 'Quotes', icon: <FileText className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
    { id: 'deliveries', label: 'Dispatch', icon: <Truck className="w-4 h-4" /> },
    { id: 'deals', label: 'Deals', icon: <Target className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <HardHat className="w-4 h-4" /> },
    { id: 'customers', label: 'CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <nav
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 overflow-x-auto overscroll-x-contain shadow-2xl"
      style={{ minHeight: '62px', paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile and Tablet Touch Navigation"
    >
      <div className="flex min-w-max items-center justify-around gap-1.5 mx-auto">
        {portalMode === 'business' ? (
          <>
            {quickTabs.map((tab) => {
              const isActive = activeBizTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectBizTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center min-w-[54px] sm:min-w-[64px] px-2 py-1.5 rounded-xl transition-all active:scale-95 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}

            {/* Direct Client Portal switch button on touch navigation */}
            <button
              type="button"
              onClick={() => onSwitchPortal('customer')}
              className="flex flex-col items-center justify-center min-w-[62px] px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 active:scale-95 transition-all shadow-sm"
              title="Open Client Self-Service Portal"
            >
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Client</span>
            </button>
          </>
        ) : (
          /* Client Portal View */
          <div className="w-full flex items-center justify-between gap-2 px-2">
            <button
              type="button"
              onClick={() => onSwitchPortal('business')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Business ERP</span>
            </button>

            <span className="text-[11px] font-mono text-emerald-500 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Client Portal Active
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};
