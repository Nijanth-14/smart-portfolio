import React from 'react';

interface PortfolioCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PortfolioCard({ title, icon, children, className = '' }: PortfolioCardProps) {
  return (
    <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-slate-500/50 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        {icon && <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">{icon}</div>}
        <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
      </div>
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
}
