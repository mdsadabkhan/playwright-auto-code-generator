import { TestStep, GeneratedTest, HealingStrategy } from '../types';

export function generatePlaywrightCode(steps: TestStep[], testName: string = 'Generated Test'): string {
  const imports = `import { test, expect, Page } from '@playwright/test';

`;

  const testFunction = `test('${testName}', async ({ page }) => {
${steps.map(step => generateStepCode(step)).join('\n')}
});

`;

  const healingHelpers = `// Self-healing helper functions
async function findElementWithHealing(page: Page, selector: string, fallbackSelectors: string[] = []): Promise<any> {
  try {
    return await page.locator(selector);
  } catch (error) {
    console.warn(\`Primary selector failed: \${selector}\`);
    
    for (const fallback of fallbackSelectors) {
      try {
        console.log(\`Trying fallback selector: \${fallback}\`);
        return await page.locator(fallback);
      } catch (fallbackError) {
        console.warn(\`Fallback selector failed: \${fallback}\`);
      }
    }
    
    throw new Error(\`All selectors failed for: \${selector}\`);
  }
}

async function smartWait(page: Page, condition: string, timeout: number = 5000): Promise<void> {
  try {
    switch (condition) {
      case 'networkidle':
        await page.waitForLoadState('networkidle', { timeout });
        break;
      case 'domcontentloaded':
        await page.waitForLoadState('domcontentloaded', { timeout });
        break;
      default:
        await page.waitForTimeout(1000);
    }
  } catch (error) {
    console.warn(\`Wait condition '\${condition}' timed out, continuing...\`);
  }
}
`;

  return imports + testFunction + healingHelpers;
}

function generateStepCode(step: TestStep): string {
  const indent = '  ';
  
  switch (step.type) {
    case 'navigate':
      return `${indent}await page.goto('${step.value}');`;
    
    case 'click':
      return `${indent}// ${step.description}
${indent}await findElementWithHealing(page, '${step.selector}', ${generateFallbackSelectors(step.selector)}).click();`;
    
    case 'fill':
      return `${indent}// ${step.description}
${indent}await findElementWithHealing(page, '${step.selector}', ${generateFallbackSelectors(step.selector)}).fill('${step.value}');`;
    
    case 'select':
      return `${indent}// ${step.description}
${indent}await findElementWithHealing(page, '${step.selector}', ${generateFallbackSelectors(step.selector)}).selectOption('${step.value}');`;
    
    case 'wait':
      return `${indent}// ${step.description}
${indent}await smartWait(page, '${step.value}', 5000);`;
    
    case 'assertion':
      return `${indent}// ${step.description}
${indent}await expect(findElementWithHealing(page, '${step.selector}', ${generateFallbackSelectors(step.selector)})).toContainText('${step.value}');`;
    
    case 'screenshot':
      return `${indent}// ${step.description}
${indent}await page.screenshot({ path: 'test-results/${step.value || 'screenshot'}.png', fullPage: true });`;
    
    default:
      return `${indent}// Unknown step type: ${step.type}`;
  }
}

function generateFallbackSelectors(primarySelector: string): string {
  const fallbacks: string[] = [];
  
  // Generate intelligent fallback selectors based on the primary selector
  if (primarySelector.includes('#')) {
    // If it's an ID selector, try class-based alternatives
    const id = primarySelector.replace('#', '');
    fallbacks.push(`[data-testid="${id}"]`);
    fallbacks.push(`[id*="${id}"]`);
    fallbacks.push(`[class*="${id}"]`);
  } else if (primarySelector.includes('.')) {
    // If it's a class selector, try other attributes
    const className = primarySelector.replace('.', '');
    fallbacks.push(`[data-testid*="${className}"]`);
    fallbacks.push(`[class*="${className}"]`);
    fallbacks.push(`[id*="${className}"]`);
  } else if (primarySelector.includes('[data-testid')) {
    // If it's already a data-testid, try other stable attributes
    const testId = primarySelector.match(/data-testid="([^"]+)"/)?.[1];
    if (testId) {
      fallbacks.push(`[aria-label*="${testId}"]`);
      fallbacks.push(`[id*="${testId}"]`);
      fallbacks.push(`[name*="${testId}"]`);
    }
  }
  
  // Add generic fallbacks
  fallbacks.push(`${primarySelector.split(' ')[0]} >> nth=0`);
  
  return JSON.stringify(fallbacks);
}

export function generateCICDConfig(platform: 'github' | 'gitlab' | 'jenkins' = 'github'): string {
  switch (platform) {
    case 'github':
      return `name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps \${{ matrix.browser }}
    
    - name: Run Playwright tests
      run: npx playwright test --project=\${{ matrix.browser }}
      env:
        PLAYWRIGHT_JUNIT_OUTPUT_NAME: results.xml
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-\${{ matrix.browser }}
        path: |
          playwright-report/
          test-results/
        retention-days: 30
    
    - name: Publish Test Results
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Playwright Tests (\${{ matrix.browser }})
        path: results.xml
        reporter: jest-junit`;

    case 'gitlab':
      return `stages:
  - test

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

cache:
  paths:
    - .npm/
    - node_modules/

playwright-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  parallel:
    matrix:
      - BROWSER: [chromium, firefox, webkit]
  script:
    - npm ci
    - npx playwright test --project=$BROWSER
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 1 week
    reports:
      junit: results.xml`;

    case 'jenkins':
      return `pipeline {
    agent any
    
    tools {
        nodejs '18'
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Chromium') {
                    steps {
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    steps {
                        sh 'npx playwright test --project=webkit'
                    }
                }
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
            
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}`;

    default:
      return generateCICDConfig('github');
  }
}

export function generatePlaywrightConfig(): string {
  return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'results.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`;
}