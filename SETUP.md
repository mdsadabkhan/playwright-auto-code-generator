# Local Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js 18+**: [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git**: [Download from git-scm.com](https://git-scm.com/)
- **VS Code** (recommended): [Download from code.visualstudio.com](https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Create Project Directory

```bash
mkdir playwright-test-automation
cd playwright-test-automation
```

### 2. Initialize Git Repository

```bash
git init
```

### 3. Copy All Files

Copy all the files from this project structure into your local directory:

```
playwright-test-automation/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Header.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx
│   │   └── recording/
│   │       ├── QuickActions.tsx
│   │       ├── RecordingControls.tsx
│   │       └── StepsList.tsx
│   ├── context/
│   │   └── RecordingContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── codeGenerator.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── public/
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── README.md
└── SETUP.md
```

### 4. Install Dependencies

```bash
npm install
```

This will install all the required dependencies:
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Monaco Editor (code editor)
- Lucide React (icons)
- ESLint (linting)

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### 6. Verify Installation

Open your browser and navigate to `http://localhost:5173`. You should see:
- Modern dark interface with neon blue accents
- Navigation tabs: Dashboard, Test Recording, Code Editor
- Animated components and smooth transitions
- Responsive design that works on different screen sizes

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

### VS Code Setup

1. Install recommended extensions (VS Code will prompt you)
2. The workspace is configured with:
   - Auto-formatting on save
   - ESLint integration
   - Tailwind CSS IntelliSense
   - TypeScript support

### File Structure Explanation

- **`src/components/`**: All React components organized by feature
- **`src/context/`**: React Context for state management
- **`src/types/`**: TypeScript type definitions
- **`src/utils/`**: Utility functions and code generators
- **`src/App.tsx`**: Main application component with routing
- **`src/main.tsx`**: Application entry point

## Customization

### Colors and Theme

Edit `tailwind.config.js` to customize the color scheme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00D4FF',
        'electric-blue': '#2323FF',
        // Add your custom colors
      }
    }
  }
}
```

### Components

All components are in `src/components/` and can be customized:
- **Common components**: Reusable UI elements
- **Dashboard**: Analytics and overview
- **Recording**: Test recording interface
- **Editor**: Code generation and editing

## Deployment Options

### 1. Static Hosting (Netlify, Vercel)

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### 2. Docker

```bash
# Build and run with Docker
docker build -t playwright-automation .
docker run -p 3000:80 playwright-automation
```

### 3. Docker Compose

```bash
# Development
docker-compose --profile dev up

# Production
docker-compose up
```

## Troubleshooting

### Common Issues

**Port 5173 already in use**
```bash
# Kill process using the port
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Node modules issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Check TypeScript configuration
npm run type-check
```

**Build errors**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Getting Help

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is 18+
4. Check the GitHub issues for similar problems

## Next Steps

1. **Customize the UI**: Modify components to match your brand
2. **Add Backend**: Implement API endpoints for data persistence
3. **Extend Features**: Add more test recording capabilities
4. **Deploy**: Choose your preferred hosting solution

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

---

You're all set! The application should now be running locally with all features working. Enjoy building modern Playwright test automation! 🚀