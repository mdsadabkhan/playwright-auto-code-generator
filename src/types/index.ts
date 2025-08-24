export interface TestStep {
  id: string;
  type: 'navigate' | 'click' | 'fill' | 'select' | 'wait' | 'assertion' | 'screenshot';
  selector: string;
  value?: string;
  description: string;
  screenshot?: string;
  timestamp: number;
}

export interface GeneratedTest {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  assertions: Assertion[];
  metadata: {
    url: string;
    viewport: { width: number; height: number };
    createdAt: Date;
    lastModified: Date;
  };
}

export interface Assertion {
  id: string;
  type: 'text' | 'attribute' | 'visible' | 'count' | 'url';
  selector: string;
  expected: string;
  description: string;
}

export interface SelfHealingConfig {
  enabledStrategies: HealingStrategy[];
  confidenceThreshold: number;
  maxRetryAttempts: number;
  fallbackTimeout: number;
}

export enum HealingStrategy {
  ATTRIBUTE_MATCHING = 'attribute_matching',
  TEXT_CONTENT_MATCHING = 'text_content_matching',
  POSITIONAL_MATCHING = 'positional_matching',
  VISUAL_AI_MATCHING = 'visual_ai_matching',
  SEMANTIC_SIMILARITY = 'semantic_similarity'
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  currentTest: GeneratedTest | null;
  steps: TestStep[];
  healingConfig: SelfHealingConfig;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tests: GeneratedTest[];
  createdAt: Date;
  lastModified: Date;
}