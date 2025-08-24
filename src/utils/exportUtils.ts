import { GeneratedTest, TestStep } from '../types';
import { generatePlaywrightCode, generatePlaywrightConfig, generateCICDConfig } from './codeGenerator';

export interface ExportOptions {
  includeConfig?: boolean;
  includeCICD?: boolean;
  cicdPlatform?: 'github' | 'gitlab' | 'jenkins';
  format?: 'zip' | 'files';
}

export async function exportTestSuite(
  test: GeneratedTest,
  steps: TestStep[],
  options: ExportOptions = {}
) {
  const {
    includeConfig = true,
    includeCICD = true,
    cicdPlatform = 'github',
    format = 'zip'
  } = options;

  const files: { [filename: string]: string } = {};

  // Generate main test file
  const testCode = generatePlaywrightCode(steps, test.name);
  files[`tests/${test.name.toLowerCase().replace(/\s+/g, '-')}.spec.ts`] = testCode;

  // Generate Playwright config
  if (includeConfig) {
    files['playwright.config.ts'] = generatePlaywrightConfig();
  }

  // Generate CI/CD configuration
  if (includeCICD) {
    const cicdConfig = generateCICDConfig(cicdPlatform);
    const cicdFilename = {
      github: '.github/workflows/playwright.yml',
      gitlab: '.gitlab-ci.yml',
      jenkins: 'Jenkinsfile'
    }[cicdPlatform];
    files[cicdFilename] = cicdConfig;
  }

  // Generate package.json for the test project
  files['package.json'] = generatePackageJson(test.name);

  // Generate README
  files['README.md'] = generateTestReadme(test);

  if (format === 'zip') {
    return await createZipFile(files);
  } else {
    return files;
  }
}

function generatePackageJson(testName: string): string {
  return JSON.stringify({
    name: testName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: `Playwright tests for ${testName}`,
    scripts: {
      test: 'playwright test',
      'test:headed': 'playwright test --headed',
      'test:debug': 'playwright test --debug',
      report: 'playwright show-report'
    },
    devDependencies: {
      '@playwright/test': '^1.40.0'
    }
  }, null, 2);
}

function generateTestReadme(test: GeneratedTest): string {
  return `# ${test.name}

${test.description}

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Install Playwright browsers:
\`\`\`bash
npx playwright install
\`\`\`

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# Show test report
npm run report
\`\`\`

## Test Details

- **Created**: ${test.metadata.createdAt.toLocaleDateString()}
- **Target URL**: ${test.metadata.url}
- **Viewport**: ${test.metadata.viewport.width}x${test.metadata.viewport.height}
- **Steps**: ${test.steps.length}
- **Assertions**: ${test.assertions.length}

## Self-Healing Features

This test includes self-healing capabilities:
- Multiple fallback selectors
- Intelligent element matching
- Automatic retry mechanisms
- Smart wait conditions

## CI/CD Integration

The test is configured for continuous integration with automated pipeline configuration.
`;
}

async function createZipFile(files: { [filename: string]: string }): Promise<Blob> {
  // This is a simplified implementation
  // In a real application, you'd use a library like JSZip
  const zipContent = Object.entries(files)
    .map(([filename, content]) => `=== ${filename} ===\n${content}\n`)
    .join('\n\n');

  return new Blob([zipContent], { type: 'text/plain' });
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadZip(files: { [filename: string]: string }, zipName: string) {
  // Create a simple text file with all contents
  // In production, use JSZip for proper ZIP creation
  const content = Object.entries(files)
    .map(([filename, fileContent]) => 
      `// File: ${filename}\n${fileContent}\n${'='.repeat(50)}\n`
    )
    .join('\n');

  downloadFile(content, `${zipName}.txt`, 'text/plain');
}