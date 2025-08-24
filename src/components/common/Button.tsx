import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  glowEffect?: boolean;
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  glowEffect = false,
}: ButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-lg border transition-all duration-200
    font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
    focus:ring-offset-black focus:ring-blue-400
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const glowClasses = glowEffect
    ? `shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]`
    : '';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${glowClasses}`}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
}