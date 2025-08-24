import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'border-blue-500', 
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        border-2 border-gray-600 ${color} border-t-transparent 
        rounded-full ${className}
      `}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </motion.div>
  );
}