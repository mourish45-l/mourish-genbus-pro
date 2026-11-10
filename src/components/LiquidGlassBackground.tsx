import React from 'react';

interface Props {
  isDark: boolean;
}

export const LiquidGlassBackground: React.FC<Props> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Crisp, lag-free base background */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? 'bg-slate-950' : 'bg-slate-50'
        }`}
      />

      {/* Lightweight hardware-accelerated static ambient glow - zero GPU lag */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 15% 15%, rgba(79, 70, 229, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.1) 0%, transparent 45%)'
            : 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.06) 0%, transparent 40%)',
        }}
      />
    </div>
  );
};
