import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this operation?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary'
  onConfirm,
  onClose,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-modal border border-[#E6ECE8] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              confirmVariant === 'danger' ? 'bg-rose-50 text-[#D94848]' : 'bg-[#EAF5EF] text-[#146B45]'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17231D]">{title}</h3>
              <p className="text-xs text-[#66736B] mt-0.5">{description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#66736B] hover:text-[#17231D] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-3 border-t border-[#E6ECE8] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-[#17231D] bg-[#F1F5F2] hover:bg-[#E6ECE8] rounded-lg transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition shadow-xs flex items-center gap-1.5 ${
              confirmVariant === 'danger'
                ? 'bg-[#D94848] hover:bg-[#b83838]'
                : 'bg-[#146B45] hover:bg-[#104B35]'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
