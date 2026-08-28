import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'neutral' | 'indigo';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}) => {
  const variantStyles = {
    default: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 border border-slate-700/50',
    secondary: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    outline: 'border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-400',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    destructive: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/60',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Modal / Dialog Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div 
        className={cn(
          'relative w-full bg-white dark:bg-[#16191E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
            {description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
