import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { RecordingState, TestStep, GeneratedTest, HealingStrategy } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RecordingContextType {
  state: RecordingState;
  startRecording: (testName: string, url: string) => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  addStep: (step: Omit<TestStep, 'id' | 'timestamp'>) => void;
  removeStep: (stepId: string) => void;
  updateStep: (stepId: string, updates: Partial<TestStep>) => void;
  clearSteps: () => void;
  updateHealingConfig: (config: Partial<RecordingState['healingConfig']>) => void;
}

type RecordingAction =
  | { type: 'START_RECORDING'; payload: { testName: string; url: string } }
  | { type: 'PAUSE_RECORDING' }
  | { type: 'STOP_RECORDING' }
  | { type: 'ADD_STEP'; payload: TestStep }
  | { type: 'REMOVE_STEP'; payload: string }
  | { type: 'UPDATE_STEP'; payload: { stepId: string; updates: Partial<TestStep> } }
  | { type: 'CLEAR_STEPS' }
  | { type: 'UPDATE_HEALING_CONFIG'; payload: Partial<RecordingState['healingConfig']> };

const initialState: RecordingState = {
  isRecording: false,
  isPaused: false,
  currentTest: null,
  steps: [],
  healingConfig: {
    enabledStrategies: [
      HealingStrategy.ATTRIBUTE_MATCHING,
      HealingStrategy.TEXT_CONTENT_MATCHING,
      HealingStrategy.POSITIONAL_MATCHING
    ],
    confidenceThreshold: 0.8,
    maxRetryAttempts: 3,
    fallbackTimeout: 5000
  }
};

function recordingReducer(state: RecordingState, action: RecordingAction): RecordingState {
  switch (action.type) {
    case 'START_RECORDING':
      const newTest: GeneratedTest = {
        id: uuidv4(),
        name: action.payload.testName,
        description: `Generated test for ${action.payload.url}`,
        steps: [],
        assertions: [],
        metadata: {
          url: action.payload.url,
          viewport: { width: 1920, height: 1080 },
          createdAt: new Date(),
          lastModified: new Date()
        }
      };
      return {
        ...state,
        isRecording: true,
        isPaused: false,
        currentTest: newTest,
        steps: []
      };

    case 'PAUSE_RECORDING':
      return { ...state, isPaused: !state.isPaused };

    case 'STOP_RECORDING':
      return {
        ...state,
        isRecording: false,
        isPaused: false
      };

    case 'ADD_STEP':
      return {
        ...state,
        steps: [...state.steps, action.payload]
      };

    case 'REMOVE_STEP':
      return {
        ...state,
        steps: state.steps.filter(step => step.id !== action.payload)
      };

    case 'UPDATE_STEP':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload.stepId
            ? { ...step, ...action.payload.updates }
            : step
        )
      };

    case 'CLEAR_STEPS':
      return { ...state, steps: [] };

    case 'UPDATE_HEALING_CONFIG':
      return {
        ...state,
        healingConfig: { ...state.healingConfig, ...action.payload }
      };

    default:
      return state;
  }
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export function RecordingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recordingReducer, initialState);

  const startRecording = (testName: string, url: string) => {
    dispatch({ type: 'START_RECORDING', payload: { testName, url } });
  };

  const pauseRecording = () => {
    dispatch({ type: 'PAUSE_RECORDING' });
  };

  const stopRecording = () => {
    dispatch({ type: 'STOP_RECORDING' });
  };

  const addStep = (stepData: Omit<TestStep, 'id' | 'timestamp'>) => {
    const step: TestStep = {
      ...stepData,
      id: uuidv4(),
      timestamp: Date.now()
    };
    dispatch({ type: 'ADD_STEP', payload: step });
  };

  const removeStep = (stepId: string) => {
    dispatch({ type: 'REMOVE_STEP', payload: stepId });
  };

  const updateStep = (stepId: string, updates: Partial<TestStep>) => {
    dispatch({ type: 'UPDATE_STEP', payload: { stepId, updates } });
  };

  const clearSteps = () => {
    dispatch({ type: 'CLEAR_STEPS' });
  };

  const updateHealingConfig = (config: Partial<RecordingState['healingConfig']>) => {
    dispatch({ type: 'UPDATE_HEALING_CONFIG', payload: config });
  };

  return (
    <RecordingContext.Provider
      value={{
        state,
        startRecording,
        pauseRecording,
        stopRecording,
        addStep,
        removeStep,
        updateStep,
        clearSteps,
        updateHealingConfig
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
}