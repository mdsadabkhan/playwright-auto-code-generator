import React from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer, 
  Type, 
  Navigation, 
  Clock, 
  CheckCircle, 
  Camera,
  Copy,
  Download,
  Play,
  Eye
} from 'lucide-react';
import { useRecording } from '../../context/RecordingContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const quickActions = [
  {
    id: 'click',
    label: 'Record Click',
    icon: MousePointer,
    color: 'text-green-400',
    description: 'Record mouse click interactions'
  },
  {
    id: 'fill',
    label: 'Record Input',
    icon: Type,
    color: 'text-yellow-400',
    description: 'Record form field inputs'
  },
  {
    id: 'navigate',
    label: 'Navigate',
    icon: Navigation,
    color: 'text-blue-400',
    description: 'Record page navigation'
  },
  {
    id: 'wait',
    label: 'Add Wait',
    icon: Clock,
    color: 'text-orange-400',
    description: 'Add wait conditions'
  },
  {
    id: 'assertion',
    label: 'Add Assertion',
    icon: CheckCircle,
    color: 'text-emerald-400',
    description: 'Add verification steps'
  },
  {
    id: 'screenshot',
    label: 'Screenshot',
    icon: Camera,
    color: 'text-pink-400',
    description: 'Capture page screenshot'
  }
];

export function QuickActions() {
  const { addStep, state } = useRecording();

  const handleQuickAction = (actionType: string) => {
    const actionMap = {
      click: {
        type: 'click' as const,
        selector: '.quick-action-element',
        description: 'Quick click action',
        value: undefined
      },
      fill: {
        type: 'fill' as const,
        selector: 'input[type="text"]',
        description: 'Quick fill action',
        value: 'Sample text'
      },
      navigate: {
        type: 'navigate' as const,
        selector: '',
        description: 'Navigate to page',
        value: 'https://example.com'
      },
      wait: {
        type: 'wait' as const,
        selector: '',
        description: 'Wait for condition',
        value: 'networkidle'
      },
      assertion: {
        type: 'assertion' as const,
        selector: 'h1',
        description: 'Assert page title',
        value: 'Expected Title'
      },
      screenshot: {
        type: 'screenshot' as const,
        selector: '',
        description: 'Take page screenshot',
        value: 'page-screenshot.png'
      }
    };

    if (actionMap[actionType as keyof typeof actionMap]) {
      addStep(actionMap[actionType as keyof typeof actionMap]);
    }
  };

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.id)}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 
                         hover:border-blue-500/50 transition-all duration-200 group"
              disabled={!state.isRecording}
              title={action.description}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-gray-300 text-center">{action.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-700 space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Test Actions</h4>
        
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 text-xs"
            disabled={state.steps.length === 0}
          >
            <Play className="h-3 w-3" />
            Run Test
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 text-xs"
            disabled={state.steps.length === 0}
          >
            <Copy className="h-3 w-3" />
            Copy Code
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 text-xs"
            disabled={state.steps.length === 0}
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}