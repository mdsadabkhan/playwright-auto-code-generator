import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, User } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      className="bg-black border-b border-gray-800 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PlaywrightAI</h1>
            <p className="text-sm text-gray-400">Self-Healing Test Automation</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <motion.a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Dashboard
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Projects
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Documentation
          </motion.a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-5 w-5" />
          </motion.button>
          <motion.button
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}