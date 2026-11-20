import React from 'react';

export default function StatCard({
  title,
  value,
  sublabel,
  icon: Icon,
  trend,
  trendLabel,
  badge,
  className = ''
}) {
  return (
    <div className={`bg-white rounded-xl p-5 border border-[#E6ECE8] shadow-sm transition hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-[#66736B] block uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-bold text-[#17231D] tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(sublabel || trend || badge) && (
        <div className="mt-3 pt-3 border-t border-[#F1F5F2] flex items-center justify-between text-xs">
          {sublabel && (
            <span className="text-[#66736B] truncate">{sublabel}</span>
          )}

          {trend && (
            <div className={`flex items-center gap-1 font-semibold ${trend > 0 ? 'text-[#16834A]' : 'text-[#D94848]'}`}>
              <span>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>
              {trendLabel && <span className="font-normal text-[#66736B]">{trendLabel}</span>}
            </div>
          )}

          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EF] text-[#146B45] border border-[#146B45]/20">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
