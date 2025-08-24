import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className = '',
  glowEffect = false,
  padding = 'md',
}: CardProps) {
  const baseClasses = `
    bg-gray-900 border border-gray-700 rounded-xl
    backdrop-blur-sm transition-all duration-300
    ${paddingClasses[padding]}
  `;

  const glowClasses = glowEffect
    ? 'shadow-[0_0_25px_rgba(0,212,255,0.1)] hover:shadow-[0_0_35px_rgba(0,212,255,0.2)] border-blue-500/30'
    : 'hover:border-gray-600';

  return (
    <motion.div
      className={`${baseClasses} ${glowClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.div>
  );
}