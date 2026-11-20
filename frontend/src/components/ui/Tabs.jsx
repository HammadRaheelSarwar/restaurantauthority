import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-1 border-b border-[#E6ECE8] overflow-x-auto custom-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-3 text-xs font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              isActive
                ? 'border-[#146B45] text-[#146B45]'
                : 'border-transparent text-[#66736B] hover:text-[#17231D] hover:border-[#CBD5CD]'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-[#EAF5EF] text-[#146B45]' : 'bg-[#F1F5F2] text-[#66736B]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
