import React from 'react';
import { ToastMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, Trophy } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onDismiss(toast.id)}
              className="pointer-events-auto cursor-pointer bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-2xl shadow-lg flex items-center gap-3 text-xs"
            >
              <div className="text-xl">
                {toast.type === 'achievement' ? '🏆' : toast.type === 'success' ? '✨' : '💧'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-stone-900">{toast.title}</div>
                {toast.description && (
                  <div className="text-[11px] text-stone-600 mt-0.5">{toast.description}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
