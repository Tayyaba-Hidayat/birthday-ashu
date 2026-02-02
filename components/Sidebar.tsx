
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.IMAGEN, label: 'Image Gen', icon: '✨' },
    { id: AppTab.EDIT, label: 'Image Edit', icon: '🎨' },
    { id: AppTab.VEO, label: 'Video Gen', icon: '🎬' },
    { id: AppTab.LIVE, label: 'Live Voice', icon: '🎙️' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-lg">💎</span>
        </div>
        <h1 className="hidden md:block font-bold text-xl tracking-tight text-white">OmniStudio</h1>
      </div>

      <nav className="flex-1 px-3 space-y-2 py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === tab.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{tab.icon}</span>
            <span className="hidden md:block font-medium">{tab.label}</span>
            {activeTab === tab.id && (
               <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="hidden md:flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">AI</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Gemini 3 Pro</p>
            <p className="text-[10px] text-slate-500">Preview Engine</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
