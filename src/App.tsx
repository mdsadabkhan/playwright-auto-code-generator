import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Home, Code, Settings, Zap } from 'lucide-react';

import { RecordingProvider } from './context/RecordingContext';
import { Header } from './components/common/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { RecordingControls } from './components/recording/RecordingControls';
import { StepsList } from './components/recording/StepsList';
import { QuickActions } from './components/recording/QuickActions';
import { CodeEditor } from './components/editor/CodeEditor';
import { Button } from './components/common/Button';

type ActiveView = 'dashboard' | 'recording' | 'editor';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'recording' as const, label: 'Test Recording', icon: Play },
    { id: 'editor' as const, label: 'Code Editor', icon: Code },
  ];

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'recording':
        return (
          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* Left Column - Controls and Actions */}
            <div className="space-y-6">
              <RecordingControls />
              <QuickActions />
            </div>
            
            {/* Right Column - Steps List */}
            <div className="lg:col-span-2">
              <StepsList />
            </div>
          </div>
        );
      
      case 'editor':
        return <CodeEditor />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <RecordingProvider>
      <div className="min-h-screen bg-black">
        {/* Animated background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-black to-cyan-900/10" />
        
        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgb(59, 130, 246, 0.15) 1px, transparent 0)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10">
          <Header />
          
          {/* Navigation */}
          <nav className="bg-black border-b border-gray-800 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex space-x-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`
                        relative py-4 px-2 text-sm font-medium transition-colors
                        flex items-center gap-2
                        ${isActive 
                          ? 'text-blue-400 border-b-2 border-blue-400' 
                          : 'text-gray-400 hover:text-white'
                        }
                      `}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-500/10 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[calc(100vh-200px)]"
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Floating Action Button for Quick Recording */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={() => setActiveView('recording')}
              className="w-14 h-14 rounded-full shadow-2xl"
              glowEffect
              variant="primary"
            >
              <Zap className="h-6 w-6" />
            </Button>
          </motion.div>

          {/* Footer */}
          <footer className="border-t border-gray-800 bg-black/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  © 2025 PlaywrightAI. Powered by advanced self-healing automation.
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">Documentation</a>
                  <a href="#" className="hover:text-white transition-colors">API</a>
                  <a href="#" className="hover:text-white transition-colors">Support</a>
                  <a href="#" className="hover:text-white transition-colors">Status</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </RecordingProvider>
  );
}

export default App;