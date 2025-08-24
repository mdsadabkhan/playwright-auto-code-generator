import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  Settings, 
  Globe,
  Zap
} from 'lucide-react';
import { useRecording } from '../../context/RecordingContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export function RecordingControls() {
  const { state, startRecording, pauseRecording, stopRecording, clearSteps } = useRecording();
  const [testName, setTestName] = useState('New Test');
  const [targetUrl, setTargetUrl] = useState('https://example.com');

  const handleStartRecording = () => {
    startRecording(testName, targetUrl);
  };

  const getRecordingStatus = () => {
    if (!state.isRecording) return 'idle';
    if (state.isPaused) return 'paused';
    return 'recording';
  };

  const statusColors = {
    idle: 'text-gray-400',
    recording: 'text-red-400',
    paused: 'text-yellow-400',
  };

  const statusText = {
    idle: 'Ready to record',
    recording: 'Recording in progress...',
    paused: 'Recording paused',
  };

  return (
    <Card glowEffect={state.isRecording} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          Recording Controls
        </h2>
        <motion.div 
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[getRecordingStatus()]}`}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ repeat: state.isRecording && !state.isPaused ? Infinity : 0, duration: 1 }}
        >
          {statusText[getRecordingStatus()]}
        </motion.div>
      </div>

      {/* Test Configuration */}
      <AnimatePresence>
        {!state.isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Test Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter test name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Target URL
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3">
        {!state.isRecording ? (
          <Button
            onClick={handleStartRecording}
            variant="success"
            className="flex items-center gap-2"
            glowEffect
            disabled={!testName.trim() || !targetUrl.trim()}
          >
            <Play className="h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={pauseRecording}
              variant="warning"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              {state.isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button
              onClick={stopRecording}
              variant="danger"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Recording
            </Button>
          </>
        )}

        <Button
          onClick={clearSteps}
          variant="secondary"
          className="flex items-center gap-2"
          disabled={state.steps.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear Steps
        </Button>

        <Button
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Recording Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{state.steps.length}</div>
          <div className="text-sm text-gray-400">Steps Recorded</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {state.healingConfig.enabledStrategies.length}
          </div>
          <div className="text-sm text-gray-400">Healing Strategies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {(state.healingConfig.confidenceThreshold * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-400">Confidence</div>
        </div>
      </div>
    </Card>
  );
}