import React from 'react';

export default function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 bg-[#F1F5F2] rounded-xl w-full border border-[#E6ECE8]"></div>
      ))}
    </div>
  );
}
