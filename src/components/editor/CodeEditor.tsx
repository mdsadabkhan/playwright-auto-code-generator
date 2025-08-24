import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Copy, 
  Download, 
  Code, 
  Eye, 
  EyeOff, 
  FileText,
  Settings,
  Play,
  RefreshCw
} from 'lucide-react';
import { useRecording } from '../../context/RecordingContext';
import { generatePlaywrightCode, generatePlaywrightConfig, generateCICDConfig } from '../../utils/codeGenerator';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

type CodeTab = 'test' | 'config' | 'cicd';

export function CodeEditor() {
  const { state } = useRecording();
  const [activeTab, setActiveTab] = useState<CodeTab>('test');
  const [isVisible, setIsVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = useCallback(() => {
    switch (activeTab) {
      case 'test':
        return generatePlaywrightCode(
          state.steps, 
          state.currentTest?.name || 'Generated Test'
        );
      case 'config':
        return generatePlaywrightConfig();
      case 'cicd':
        return generateCICDConfig('github');
      default:
        return '';
    }
  }, [activeTab, state.steps, state.currentTest]);

  const handleCopyCode = async () => {
    const code = generateCode();
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownloadCode = () => {
    const code = generateCode();
    const filename = {
      test: `${state.currentTest?.name || 'test'}.spec.ts`,
      config: 'playwright.config.ts',
      cicd: '.github/workflows/playwright.yml'
    }[activeTab];

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRegenerateCode = () => {
    setIsGenerating(true);
    // Simulate code regeneration delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  const tabs = [
    { id: 'test' as const, label: 'Test Code', icon: Code },
    { id: 'config' as const, label: 'Config', icon: Settings },
    { id: 'cicd' as const, label: 'CI/CD', icon: FileText }
  ];

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 shadow-lg"
          glowEffect
        >
          <Eye className="h-4 w-4" />
          Show Code Editor
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-400" />
              Generated Code
            </h3>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                      flex items-center gap-1.5
                      ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="h-3 w-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRegenerateCode}
              disabled={isGenerating}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadCode}
              className="flex items-center gap-1.5"
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsVisible(false)}
              className="flex items-center gap-1.5"
            >
              <EyeOff className="h-3 w-3" />
              Hide
            </Button>
          </div>
        </div>

        {/* Code Statistics */}
        <div className="flex items-center space-x-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">Lines: {generateCode().split('\n').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-400">Steps: {state.steps.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-400">Self-Healing: Enabled</span>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-700">
          <Editor
            height="100%"
            language={activeTab === 'cicd' ? 'yaml' : 'typescript'}
            theme="vs-dark"
            value={generateCode()}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontLigatures: true,
            }}
            loading={
              <div className="flex items-center justify-center h-full bg-gray-900">
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Loading editor...</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Footer with additional actions */}
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>TypeScript • Playwright • Self-Healing</span>
            <span>•</span>
            <span>Auto-generated at {new Date().toLocaleTimeString()}</span>
          </div>
          
          <Button
            size="sm"
            variant="success"
            className="flex items-center gap-1.5"
            disabled={state.steps.length === 0}
          >
            <Play className="h-3 w-3" />
            Run Test
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}