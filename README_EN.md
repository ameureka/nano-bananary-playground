<div align="center">

  <h1>Welcome to Banana PS Playground!</h1>
  <h2>欢迎来到香蕉PS乐园！</h2>
  <p>AI-Powered Image & Video Generation Platform</p>

  <p>
    <a href="./README.md">简体中文</a> | <a href="./README_EN.md">English</a>
  </p>

  <br/>

  <a href="https://www.youtube.com/watch?v=DnxjUjfClGQ">
    <img src="https://img.youtube.com/vi/DnxjUjfClGQ/maxresdefault.jpg" alt="Video Introduction" width="600" />
  </a>
  
  <p>
    <a href="https://www.youtube.com/watch?v=DnxjUjfClGQ">
      🎥 Watch Video Introduction / 观看视频介绍
    </a>
  </p>

  <br/>

  <p>
    <a href="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js" /></a>
    <a href="https://img.shields.io/badge/React-19-61dafb?logo=react"><img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react" /></a>
    <a href="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" /></a>
    <a href="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel"><img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" /></a>
  </p>

  <p>
    <a href="https://vercel.com/new/clone?repository-url=https://github.com/ameureka/nano-bananary-playground&project-name=nano-bananary-playground&repository-name=nano-bananary-playground&env=GEMINI_API_KEY&install-command=yarn&build-command=yarn%20build"><img alt="Deploy with Vercel" src="https://vercel.com/button" /></a>
  </p>

</div>

---

## 📖 Project Overview

Banana PS Playground is a modern AI-powered image and video generation platform built with Next.js 16, React 19, and TypeScript. Integrated with Google Gemini API, it provides powerful capabilities for image generation, editing, video creation, and AI conversations.

### ✨ Key Features

- 🎨 **Image Generation & Editing**: Text-to-image, image-to-image, editing, style transfer, batch processing
- 🎬 **Video Generation**: AI-driven video content creation
- 💬 **Smart Chat**: Gemini-powered AI chat assistant
- 📚 **Asset Library**: Unified management of generated images and videos
- 🌍 **Internationalization**: Bilingual interface (Chinese/English)
- 🎭 **Theme Switching**: Light and dark theme support
- 📱 **Responsive Design**: Desktop and mobile optimized

## 🏗️ Architecture

### Tech Stack

```
Frontend:
├── Next.js 16 (App Router)
├── React 19
├── TypeScript 5
├── Zustand 5 (State Management)
└── Material-UI (UI Components)

Backend:
├── Next.js API Routes
├── Google Gemini API
└── Server Actions

Development:
├── ESLint
├── Prettier
└── Yarn
```

### Project Structure

```
nano-bananary-playground/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # Chat-related APIs
│   │   ├── image/                # Image processing APIs
│   │   ├── video/                # Video generation APIs
│   │   └── transformations/      # Transformation suggestion APIs
│   ├── chat/                     # Chat page
│   ├── library/                  # Asset library page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (Enhancer)
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── common/                   # Common components
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── features/                 # Feature components
│   │   ├── chat/                 # Chat features
│   │   ├── enhancer/             # Enhancer features
│   │   └── library/              # Library features
│   └── layout/                   # Layout components
│       ├── MainLayout.tsx
│       ├── Sidebar.tsx
│       ├── TopAppBar.tsx
│       └── BottomNav.tsx
│
├── store/                        # Zustand state management
│   ├── enhancerStore.ts          # Enhancer state
│   ├── chatStore.ts              # Chat state
│   ├── assetLibraryStore.ts      # Asset library state
│   ├── uiStore.ts                # UI state
│   ├── logStore.ts               # Log state
│   └── selectors.ts              # State selectors
│
├── services/                     # Service layer
│   └── geminiService.ts          # Gemini API integration
│
├── lib/                          # Utilities
│   ├── env.server.ts             # Server-side environment variables
│   ├── api-utils.ts              # API utility functions
│   ├── actions.ts                # Server Actions
│   └── videoOperationStore.ts    # Video operation storage
│
├── i18n/                         # Internationalization
│   ├── translations.ts           # Translation configuration
│   ├── context.tsx               # i18n Context
│   ├── zh.ts, en.ts              # Language files
│   └── ...
│
├── types/                        # TypeScript type definitions
│   ├── api.ts                    # API types
│   └── index.ts                  # Common types
│
├── theme/                        # Theme configuration
│   └── context.tsx               # Theme Context
│
├── utils/                        # Utility functions
│   └── fileUtils.ts              # File processing utilities
│
├── .github/                      # GitHub configuration
│   └── workflows/                # CI/CD workflows
│       └── deploy.yml
│
├── docs/                         # Documentation
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── package.json                  # Project dependencies
```

## 🎯 Design Philosophy

### 1. Architectural Design Principles

**Layered Architecture**
- **Presentation Layer**: React components for UI rendering and user interaction
- **State Layer**: Zustand stores for application state management
- **Service Layer**: Unified API call encapsulation
- **Data Layer**: API Routes and Server Actions

**Modular Design**
- Code organized by functional modules (chat, enhancer, library)
- Components categorized by responsibility (common, features, layout)
- Clear dependency relationships, avoiding circular dependencies

**Type Safety**
- Comprehensive TypeScript type definitions
- API request/response type constraints
- Strict type checking

### 2. State Management Strategy

Lightweight state management using Zustand:

```typescript
// Enhancer state
enhancerStore: {
  - Transformation type selection
  - Input parameter management
  - Generation result handling
  - History tracking
}

// Chat state
chatStore: {
  - Message list
  - Session management
  - Streaming response handling
}

// Asset library state
assetLibraryStore: {
  - Asset list
  - Filtering and sorting
  - Selection mode
}

// UI state
uiStore: {
  - Sidebar expand/collapse
  - Modal states
  - Toast notifications
}
```

### 3. API Design

**RESTful Style**
```
POST   /api/image/generate        # Generate image
POST   /api/image/edit            # Edit image
POST   /api/image/batch           # Batch processing
POST   /api/image/style-mimic     # Style transfer
POST   /api/video/generate        # Generate video
GET    /api/video/status/:id      # Query video status
POST   /api/chat/generate         # Chat generation
POST   /api/chat/preprocess       # Chat preprocessing
GET    /api/transformations/suggestions  # Get transformation suggestions
```

**Unified Response Format**
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### 4. Service Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  User Interface Layer                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Enhancer │  │   Chat   │  │  Library │              │
│  │   Page   │  │   Page   │  │   Page   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│               State Management Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Enhancer  │  │  Chat    │  │  Asset   │              │
│  │  Store   │  │  Store   │  │  Store   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│              ┌──────────────────┐                       │
│              │  geminiService   │                       │
│              │ (Unified API)    │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  API Routes Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Image   │  │  Video   │  │   Chat   │              │
│  │   API    │  │   API    │  │   API    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Google Gemini API                       │
└─────────────────────────────────────────────────────────┘
```

### 5. Core Feature Implementation

**Image Generation Flow**
1. User selects transformation type (text-to-image, image-to-image, etc.)
2. Input parameters (prompts, reference images, configuration)
3. Frontend validation → API call
4. API Routes process request → geminiService
5. Gemini API generates result
6. Return result → Update state → Save to asset library

**Video Generation Flow**
1. User inputs video description and parameters
2. Call `/api/video/generate`
3. Return operation ID (async processing)
4. Poll `/api/video/status/:id` for progress
5. Get video URL when complete
6. Save to asset library

**Chat Feature Flow**
1. User sends message
2. Optional: Preprocessing (image analysis, etc.)
3. Call `/api/chat/generate`
4. Stream response
5. Real-time chat interface update

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn or npm
- Google Gemini API Key

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/ameureka/nano-bananary-playground.git
cd nano-bananary-playground

# 2. Install dependencies
yarn install

# 3. Configure environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
yarn dev

# 5. Access application
# Open browser and visit http://localhost:3000
```

### Environment Variable Configuration

Create `.env.local` file:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Optional: Other configurations
# NODE_ENV=development
```

## 📦 Build & Deploy

### Local Build

```bash
# Production build
yarn build

# Start production server
yarn start
```

### Vercel Deployment (Recommended)

**Option 1: One-Click Deploy**

Click the "Deploy with Vercel" button above

**Option 2: CLI Deploy**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variable
vercel env add GEMINI_API_KEY production

# Deploy to production
vercel deploy --prod
```

**Option 3: Git Integration**

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Auto-deploy (triggered on push to main branch)

## 🛠️ Development Guide

### Code Standards

```bash
# Code linting
yarn lint

# Code formatting
yarn format

# Type checking
yarn type-check
```

### Branch Management

- `main`: Main branch, production code
- `develop`: Development branch
- `feat/*`: New feature branches
- `fix/*`: Bug fix branches
- `docs/*`: Documentation update branches

### Commit Convention

Follow Conventional Commits:

```
feat: New feature
fix: Bug fix
docs: Documentation update
style: Code formatting
refactor: Code refactoring
test: Testing related
chore: Build/tooling related
```

Examples:
```bash
git commit -m "feat(enhancer): add batch image processing"
git commit -m "fix(chat): fix streaming response interruption"
```

## 🤔 Design Considerations

### Why Choose Next.js?

1. **Full-stack Capability**: API Routes and Server Actions simplify backend development
2. **Performance Optimization**: Automatic code splitting, image optimization, SSR/SSG
3. **Developer Experience**: Hot reload, TypeScript support, file-based routing
4. **Easy Deployment**: Native Vercel support, zero-config deployment

### Why Use Zustand?

1. **Lightweight**: Simpler than Redux, no boilerplate needed
2. **TypeScript Friendly**: Complete type inference
3. **Flexibility**: Supports middleware, persistence, DevTools
4. **Performance**: React hooks-based, fine-grained updates

### Why Adopt Modular Component Design?

1. **Maintainability**: Clear responsibilities, easy to locate and modify
2. **Reusability**: Common components can be used in multiple places
3. **Testability**: Independent components are easy to unit test
4. **Team Collaboration**: Reduces code conflicts, improves development efficiency

### API Design Considerations

1. **Unified Error Handling**: All APIs return unified format
2. **Type Safety**: Request/response type constraints
3. **Performance Optimization**: Streaming responses, async processing
4. **Security**: Server-side environment variables, avoid API key leakage

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version update details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Made with ❤️ by the Banana PS Team</p>
  <p>Powered by Google Gemini API</p>
</div>
