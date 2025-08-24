import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer, 
  Type, 
  Navigation, 
  Clock, 
  CheckCircle, 
  Camera,
  Trash2,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { useRecording } from '../../context/RecordingContext';
import { TestStep } from '../../types';
import { Card } from '../common/Card';

const stepIcons = {
  navigate: Navigation,
  click: MousePointer,
  fill: Type,
  select: MousePointer,
  wait: Clock,
  assertion: CheckCircle,
  screenshot: Camera,
};

const stepColors = {
  navigate: 'text-blue-400',
  click: 'text-green-400',
  fill: 'text-yellow-400',
  select: 'text-purple-400',
  wait: 'text-orange-400',
  assertion: 'text-emerald-400',
  screenshot: 'text-pink-400',
};

export function StepsList() {
  const { state, removeStep, updateStep } = useRecording();

  const formatSelector = (selector: string) => {
    if (selector.length > 50) {
      return selector.substring(0, 47) + '...';
    }
    return selector;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Test Steps</h3>
        <div className="text-sm text-gray-400">
          {state.steps.length} step{state.steps.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {state.steps.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-gray-400"
            >
              <AlertTriangle className="h-12 w-12 mb-3 text-gray-600" />
              <p className="text-center">No steps recorded yet.</p>
              <p className="text-sm text-center mt-1">Start recording to see your test steps here.</p>
            </motion.div>
          ) : (
            state.steps.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                onRemove={() => removeStep(step.id)}
                onUpdate={(updates) => updateStep(step.id, updates)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

interface StepItemProps {
  step: TestStep;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<TestStep>) => void;
}

function StepItem({ step, index, onRemove, onUpdate }: StepItemProps) {
  const Icon = stepIcons[step.type];
  const colorClass = stepColors[step.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600
                 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`mt-0.5 ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {step.type}
              </span>
              <span className="text-xs text-gray-600">#{index + 1}</span>
            </div>
            
            <p className="text-sm text-white font-medium mt-1 line-clamp-2">
              {step.description}
            </p>
            
            <div className="mt-2 space-y-1">
              <div className="text-xs text-gray-400">
                <span className="font-medium">Selector:</span> {formatSelector(step.selector)}
              </div>
              {step.value && (
                <div className="text-xs text-gray-400">
                  <span className="font-medium">Value:</span> {step.value}
                </div>
              )}
              <div className="text-xs text-gray-500">
                {formatTimestamp(step.timestamp)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {/* Add edit functionality */}}
            className="p-1.5 text-gray-400 hover:text-blue-400 rounded transition-colors"
            title="Edit step"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"
            title="Remove step"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}