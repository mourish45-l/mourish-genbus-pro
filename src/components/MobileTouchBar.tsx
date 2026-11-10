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
} from 'lucide-react';

interface Props {
  portalMode: PortalMode;
  activeBizTab: BusinessTab;
  onSelectBizTab: (tab: BusinessTab) => void;
}

export const MobileTouchBar: React.FC<Props> = ({ portalMode, activeBizTab, onSelectBizTab }) => {
  if (portalMode !== 'business') return null;

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
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 overflow-x-auto overscroll-x-contain"
      style={{ minHeight: '64px', paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile and Tablet Touch Navigation"
    >
      <div className="flex min-w-max items-center justify-around gap-1 sm:gap-2 mx-auto">
        {quickTabs.map((tab) => {
          const isActive = activeBizTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectBizTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-[58px] sm:w-[68px] min-h-[48px] rounded-xl transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {tab.icon}<span className="text-[9px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
