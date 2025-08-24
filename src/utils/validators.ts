import { TestStep, GeneratedTest } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTestStep(step: TestStep): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!step.type) {
    errors.push('Step type is required');
  }

  if (!step.description?.trim()) {
    errors.push('Step description is required');
  }

  // Type-specific validation
  switch (step.type) {
    case 'navigate':
      if (!step.value || !isValidUrl(step.value)) {
        errors.push('Valid URL is required for navigation steps');
      }
      break;

    case 'click':
    case 'assertion':
      if (!step.selector?.trim()) {
        errors.push('Selector is required for click and assertion steps');
      }
      break;

    case 'fill':
      if (!step.selector?.trim()) {
        errors.push('Selector is required for fill steps');
      }
      if (!step.value?.trim()) {
        errors.push('Value is required for fill steps');
      }
      break;

    case 'select':
      if (!step.selector?.trim()) {
        errors.push('Selector is required for select steps');
      }
      if (!step.value?.trim()) {
        errors.push('Option value is required for select steps');
      }
      break;

    case 'wait':
      if (!step.value?.trim()) {
        errors.push('Wait condition is required for wait steps');
      }
      break;
  }

  // Selector quality warnings
  if (step.selector) {
    const selectorWarnings = validateSelector(step.selector);
    warnings.push(...selectorWarnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateGeneratedTest(test: GeneratedTest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic test validation
  if (!test.name?.trim()) {
    errors.push('Test name is required');
  }

  if (!test.steps || test.steps.length === 0) {
    errors.push('Test must have at least one step');
  }

  if (!test.metadata?.url || !isValidUrl(test.metadata.url)) {
    errors.push('Valid target URL is required');
  }

  // Validate each step
  test.steps?.forEach((step, index) => {
    const stepValidation = validateTestStep(step);
    if (!stepValidation.isValid) {
      errors.push(`Step ${index + 1}: ${stepValidation.errors.join(', ')}`);
    }
    warnings.push(...stepValidation.warnings.map(w => `Step ${index + 1}: ${w}`));
  });

  // Test structure warnings
  if (test.steps?.length > 50) {
    warnings.push('Test has many steps - consider breaking into smaller tests');
  }

  const hasAssertions = test.steps?.some(step => step.type === 'assertion') || 
                       test.assertions?.length > 0;
  if (!hasAssertions) {
    warnings.push('Test has no assertions - consider adding verification steps');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function validateSelector(selector: string): string[] {
  const warnings: string[] = [];

  // Check for brittle selectors
  if (selector.includes('nth-child') || selector.includes('nth-of-type')) {
    warnings.push('Positional selectors (nth-child) can be brittle');
  }

  if (selector.match(/\.[a-z0-9-]+\.[a-z0-9-]+/)) {
    warnings.push('Multiple class selectors may be fragile');
  }

  if (selector.includes('>>')) {
    warnings.push('Deep selectors (>>) should be used sparingly');
  }

  // Check for good practices
  if (!selector.includes('[data-testid') && 
      !selector.includes('[aria-label') && 
      !selector.includes('#') &&
      !selector.match(/button|input|select|textarea/i)) {
    warnings.push('Consider using data-testid or semantic selectors for better stability');
  }

  return warnings;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateTestName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name?.trim()) {
    errors.push('Test name is required');
  } else {
    if (name.length < 3) {
      errors.push('Test name must be at least 3 characters long');
    }

    if (name.length > 100) {
      errors.push('Test name must be less than 100 characters');
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      errors.push('Test name can only contain letters, numbers, spaces, hyphens, and underscores');
    }

    if (name.trim() !== name) {
      warnings.push('Test name has leading or trailing whitespace');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!url?.trim()) {
    errors.push('URL is required');
  } else {
    if (!isValidUrl(url)) {
      errors.push('Invalid URL format');
    } else {
      const urlObj = new URL(url);
      
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        errors.push('URL must use HTTP or HTTPS protocol');
      }

      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        warnings.push('Testing against localhost - ensure it\'s accessible in CI/CD');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}