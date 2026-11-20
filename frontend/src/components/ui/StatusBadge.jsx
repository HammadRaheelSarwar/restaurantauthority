import React from 'react';

export default function StatusBadge({ status, variant, className = '' }) {
  const getVariantStyles = () => {
    const v = variant || (typeof status === 'string' ? status.toLowerCase() : 'neutral');
    
    if (v.includes('compliant') || v.includes('active') || v.includes('approved') || v.includes('operational') || v.includes('success') || v.includes('closed') || v.includes('passed')) {
      return {
        bg: 'bg-[#EAF5EF]',
        text: 'text-[#16834A]',
        border: 'border-[#16834A]/30',
        dot: 'bg-[#16834A]'
      };
    }
    
    if (v.includes('attention') || v.includes('progress') || v.includes('pending') || v.includes('warning') || v.includes('applied') || v.includes('submitted')) {
      return {
        bg: 'bg-amber-50',
        text: 'text-[#D99A25]',
        border: 'border-[#D99A25]/30',
        dot: 'bg-[#D99A25]'
      };
    }
    
    if (v.includes('critical') || v.includes('hazard') || v.includes('danger') || v.includes('fail') || v.includes('overdue') || v.includes('suspended')) {
      return {
        bg: 'bg-rose-50',
        text: 'text-[#D94848]',
        border: 'border-[#D94848]/30',
        dot: 'bg-[#D94848]'
      };
    }

    if (v.includes('info') || v.includes('routine') || v.includes('scheduled')) {
      return {
        bg: 'bg-blue-50',
        text: 'text-[#3984CC]',
        border: 'border-[#3984CC]/30',
        dot: 'bg-[#3984CC]'
      };
    }

    return {
      bg: 'bg-[#F1F5F2]',
      text: 'text-[#66736B]',
      border: 'border-[#E6ECE8]',
      dot: 'bg-[#66736B]'
    };
  };

  const styles = getVariantStyles();
  const label = typeof status === 'string' ? status.replace(/_/g, ' ') : String(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${styles.bg} ${styles.text} ${styles.border} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      <span>{label}</span>
    </span>
  );
}
