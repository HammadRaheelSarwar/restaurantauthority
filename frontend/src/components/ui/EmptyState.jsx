import React from 'react';

export default function EmptyState({
  icon: Icon,
  title = 'No records found',
  description = 'There is currently no data to display in this view.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-xl border border-dashed border-[#E6ECE8] bg-white space-y-3 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#146B45] mx-auto flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#17231D]">{title}</h3>
      <p className="text-xs text-[#66736B] max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-[#146B45] hover:bg-[#104B35] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
