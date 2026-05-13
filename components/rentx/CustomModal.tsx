'use client';

import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: CustomModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const icons = {
    info: <HelpCircle className="w-12 h-12 text-blue-500" />,
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    confirm: <HelpCircle className="w-12 h-12 text-primary" />
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-white/5 rounded-full">
            {icons[type]}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex w-full gap-3">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
