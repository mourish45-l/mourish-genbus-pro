import React from 'react';

interface Props {
  isDark: boolean;
}

export const LiquidGlassBackground: React.FC<Props> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Background base tone */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-[#0B0F17]'
            : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100'
        }`}
      />

      {/* Fluid Organic SVG Gradient Blobs */}
      <svg className="absolute w-full h-full opacity-60 filter blur-3xl" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fluid-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#4338CA' : '#818CF8'} stopOpacity={isDark ? '0.4' : '0.25'} />
            <stop offset="50%" stopColor={isDark ? '#065F46' : '#34D399'} stopOpacity={isDark ? '0.3' : '0.2'} />
            <stop offset="100%" stopColor={isDark ? '#1E1B4B' : '#C7D2FE'} stopOpacity={isDark ? '0.5' : '0.15'} />
          </linearGradient>
          <linearGradient id="fluid-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#0284C7' : '#38BDF8'} stopOpacity={isDark ? '0.35' : '0.2'} />
            <stop offset="100%" stopColor={isDark ? '#4F46E5' : '#6366F1'} stopOpacity={isDark ? '0.3' : '0.15'} />
          </linearGradient>
        </defs>

        {/* Top-right floating blob */}
        <circle
          cx="80%"
          cy="20%"
          r="320"
          fill="url(#fluid-grad-1)"
          className="animate-fluid-glow"
        />

        {/* Bottom-left floating blob */}
        <circle
          cx="15%"
          cy="75%"
          r="380"
          fill="url(#fluid-grad-2)"
          className="animate-fluid-glow"
          style={{ animationDelay: '-5s' }}
        />

        {/* Center accent fluid organic squircle */}
        <path
          d="M 400,300 C 550,200 680,350 620,480 C 560,610 420,580 340,490 C 260,400 250,400 400,300 Z"
          fill="url(#fluid-grad-1)"
          className="animate-fluid-glow"
          style={{ animationDelay: '-2.5s' }}
        />
      </svg>

      {/* Subtle fine glass noise grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
