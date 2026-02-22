import type { KitDetail } from '@/types';

// KitRecord extends KitDetail with raw manifest data used only by the data layer
export interface KitRecord extends KitDetail {
  status: 'pending' | 'approved' | 'rejected' | 'deprecated';
  createdAt: string;
  updatedAt: string;
  manifest: Record<string, unknown>;
}

export const KITS: KitRecord[] = [
  // ─── 1. 웹사이트 제작자 Kit ───────────────────────────────────────────────
  {
    id: 'kit-website-builder',
    name: 'website-builder-kit',
    displayName: {
      ko: '웹사이트 제작자 Kit',
      en: 'Website Builder Kit',
    },
    version: '1.2.0',
    description: {
      ko: '코딩 경험 없이도 전문적인 웹사이트를 빠르게 제작할 수 있는 입문용 Kit. 랜딩 페이지, 포트폴리오, 소규모 비즈니스 사이트에 최적화되어 있습니다.',
      en: 'A beginner-friendly Kit for building professional websites without coding experience. Optimized for landing pages, portfolios, and small business sites.',
    },
    category: 'website',
    difficulty: 1,
    icon: 'globe',
    isOfficial: true,
    author: {
      name: 'bkit Official',
      type: 'official',
      verified: true,
    },
    tags: ['no-code', 'landing-page', 'portfolio', 'beginner', 'website'],
    rating: 4.7,
    reviewCount: 312,
    installCount: 5840,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: {
            ko: '새 프로젝트를 빠르게 초기화하는 스킬',
            en: 'Skill for quickly initializing new projects',
          },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-3-mockup',
          friendlyName: { ko: '목업 생성', en: 'Mockup Generator' },
          description: {
            ko: 'UI 목업을 자동으로 생성하는 스킬',
            en: 'Skill for automatically generating UI mockups',
          },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-5-design-system',
          friendlyName: { ko: '디자인 시스템', en: 'Design System' },
          description: {
            ko: '일관된 디자인 시스템을 구축하는 스킬',
            en: 'Skill for building a consistent design system',
          },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:frontend-architect',
          friendlyName: { ko: '프론트엔드 아키텍트', en: 'Frontend Architect' },
          description: {
            ko: 'UI/UX 구조 설계를 돕는 AI 에이전트',
            en: 'AI agent that helps design UI/UX structures',
          },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'bkend',
          friendlyName: { ko: 'bkend MCP 서버', en: 'bkend MCP Server' },
          description: {
            ko: 'bkend.ai 백엔드 기능을 Claude에 연결하는 MCP 서버',
            en: 'MCP server connecting bkend.ai backend features to Claude',
          },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['next-landing-page', 'portfolio-base'],
    },
    onInstall: {
      message: {
        ko: '웹사이트 제작자 Kit 설치 완료! \'/starter init\'으로 첫 사이트를 만들어 보세요.',
        en: "Website Builder Kit installed! Create your first site with '/starter init'.",
      },
      suggestedCommand: '/starter init',
      guideUrl: 'https://marketplace.bkit.dev/guide/website-builder-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    manifest: {
      name: 'website-builder-kit',
      displayName: { ko: '웹사이트 제작자 Kit', en: 'Website Builder Kit' },
      version: '1.2.0',
      description: {
        ko: '코딩 경험 없이도 전문적인 웹사이트를 빠르게 제작할 수 있는 입문용 Kit.',
        en: 'A beginner-friendly Kit for building professional websites without coding experience.',
      },
      category: 'website',
      difficulty: 1,
      icon: 'globe',
      author: 'bkit-official',
      tags: ['no-code', 'landing-page', 'portfolio', 'beginner', 'website'],
      includes: {
        skills: ['bkit:starter', 'bkit:phase-3-mockup', 'bkit:phase-5-design-system'],
        agents: ['bkit:frontend-architect'],
        mcpServers: {
          bkend: { type: 'http', url: 'https://api.bkend.ai/mcp' },
        },
        templates: ['next-landing-page', 'portfolio-base'],
        claudeMd: {
          append: '## Website Builder Conventions\n- Use Tailwind CSS for all styling\n- Keep components simple and reusable\n- Mobile-first responsive design',
        },
      },
      onInstall: {
        message: {
          ko: '웹사이트 제작자 Kit 설치 완료! \'/starter init\'으로 시작하세요.',
          en: "Website Builder Kit installed! Start with '/starter init'.",
        },
        suggestedCommand: '/starter init',
        guideUrl: 'https://marketplace.bkit.dev/guide/website-builder-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.0.0' },
    },
  },

  // ─── 2. 프론트엔드 개발자 Kit ─────────────────────────────────────────────
  {
    id: 'kit-frontend-developer',
    name: 'frontend-developer-kit',
    displayName: {
      ko: '프론트엔드 개발자 Kit',
      en: 'Frontend Developer Kit',
    },
    version: '1.1.0',
    description: {
      ko: 'React와 Next.js로 현대적인 프론트엔드 개발을 위한 완전한 도구 세트. TypeScript, Tailwind CSS, TanStack Query 등 검증된 스택을 포함합니다.',
      en: 'A complete toolset for modern frontend development with React and Next.js. Includes TypeScript, Tailwind CSS, TanStack Query, and other proven technologies.',
    },
    category: 'frontend',
    difficulty: 2,
    icon: 'layout',
    isOfficial: true,
    author: {
      name: 'bkit Official',
      type: 'official',
      verified: true,
    },
    tags: ['react', 'nextjs', 'typescript', 'tailwind', 'frontend'],
    rating: 4.6,
    reviewCount: 189,
    installCount: 3921,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: '새 프로젝트를 빠르게 초기화', en: 'Quickly initialize new projects' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-3-mockup',
          friendlyName: { ko: '목업 생성', en: 'Mockup Generator' },
          description: { ko: 'UI 목업을 자동 생성', en: 'Auto-generate UI mockups' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-5-design-system',
          friendlyName: { ko: '디자인 시스템', en: 'Design System' },
          description: { ko: '디자인 시스템 구축', en: 'Build design systems' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-6-ui-integration',
          friendlyName: { ko: 'UI 통합', en: 'UI Integration' },
          description: { ko: 'UI 컴포넌트와 데이터를 통합', en: 'Integrate UI components with data' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: '자동화된 코드 품질 검사', en: 'Automated code quality checks' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:frontend-architect',
          friendlyName: { ko: '프론트엔드 아키텍트', en: 'Frontend Architect' },
          description: { ko: 'UI/UX 구조 설계를 돕는 에이전트', en: 'Agent for UI/UX architecture design' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:code-analyzer',
          friendlyName: { ko: '코드 분석기', en: 'Code Analyzer' },
          description: { ko: '코드 품질과 패턴을 분석', en: 'Analyzes code quality and patterns' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'bkend',
          friendlyName: { ko: 'bkend MCP 서버', en: 'bkend MCP Server' },
          description: { ko: 'bkend.ai 백엔드 연결', en: 'Connects to bkend.ai backend' },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['next-app-router', 'design-system-base'],
    },
    onInstall: {
      message: {
        ko: '프론트엔드 개발자 Kit 설치 완료! \'/starter init\'으로 새 프로젝트를 시작하세요.',
        en: "Frontend Developer Kit installed! Start a new project with '/starter init'.",
      },
      suggestedCommand: '/starter init',
      guideUrl: 'https://marketplace.bkit.dev/guide/frontend-developer-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.2.0',
      node: '>=18.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
    manifest: {
      name: 'frontend-developer-kit',
      displayName: { ko: '프론트엔드 개발자 Kit', en: 'Frontend Developer Kit' },
      version: '1.1.0',
      description: {
        ko: 'React와 Next.js로 현대적인 프론트엔드 개발을 위한 완전한 도구 세트.',
        en: 'A complete toolset for modern frontend development with React and Next.js.',
      },
      category: 'frontend',
      difficulty: 2,
      icon: 'layout',
      author: 'bkit-official',
      tags: ['react', 'nextjs', 'typescript', 'tailwind', 'frontend'],
      includes: {
        skills: [
          'bkit:starter',
          'bkit:phase-3-mockup',
          'bkit:phase-5-design-system',
          'bkit:phase-6-ui-integration',
          'bkit:code-review',
        ],
        agents: ['bkit:frontend-architect', 'bkit:code-analyzer'],
        mcpServers: {
          bkend: { type: 'http', url: 'https://api.bkend.ai/mcp' },
        },
        templates: ['next-app-router', 'design-system-base'],
        claudeMd: {
          append: '## Frontend Conventions\n- TypeScript strict mode enabled\n- TanStack Query for all data fetching\n- Zustand for global state\n- Tailwind CSS for styling\n- shadcn/ui for component library',
        },
      },
      onInstall: {
        message: {
          ko: '프론트엔드 개발자 Kit 설치 완료! \'/starter init\'으로 시작하세요.',
          en: "Frontend Developer Kit installed! Start with '/starter init'.",
        },
        suggestedCommand: '/starter init',
        guideUrl: 'https://marketplace.bkit.dev/guide/frontend-developer-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.2.0', node: '>=18.0.0' },
    },
  },

  // ─── 3. 백엔드 개발자 Kit ─────────────────────────────────────────────────
  {
    id: 'kit-backend-developer',
    name: 'backend-developer-kit',
    displayName: {
      ko: '백엔드 개발자 Kit',
      en: 'Backend Developer Kit',
    },
    version: '1.0.2',
    description: {
      ko: 'bkend.ai를 활용한 백엔드 개발의 모든 것. REST API 설계, 데이터베이스 모델링, 인증 시스템 구축까지 체계적으로 안내합니다.',
      en: 'Everything for backend development with bkend.ai. Systematically guides you through REST API design, database modeling, and auth system setup.',
    },
    category: 'backend',
    difficulty: 2,
    icon: 'server',
    isOfficial: true,
    author: {
      name: 'bkit Official',
      type: 'official',
      verified: true,
    },
    tags: ['bkend', 'api', 'database', 'rest', 'backend', 'auth'],
    rating: 4.4,
    reviewCount: 97,
    installCount: 2104,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: '새 백엔드 프로젝트를 초기화', en: 'Initialize a new backend project' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:dynamic',
          friendlyName: { ko: 'Dynamic API', en: 'Dynamic API' },
          description: {
            ko: 'bkend.ai Dynamic Level API를 구성하는 스킬',
            en: 'Skill for configuring bkend.ai Dynamic Level APIs',
          },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-4-api',
          friendlyName: { ko: 'API 설계', en: 'API Design' },
          description: { ko: 'REST API 엔드포인트를 체계적으로 설계', en: 'Systematically design REST API endpoints' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: '백엔드 코드 품질 자동 검사', en: 'Automated backend code quality checks' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:bkend-expert',
          friendlyName: { ko: 'bkend 전문가', en: 'bkend Expert' },
          description: {
            ko: 'bkend.ai 플랫폼 활용 전문 에이전트',
            en: 'Expert agent for the bkend.ai platform',
          },
          technicalType: 'agent',
        },
        {
          id: 'bkit:code-analyzer',
          friendlyName: { ko: '코드 분석기', en: 'Code Analyzer' },
          description: { ko: '코드 품질과 보안 취약점 분석', en: 'Analyzes code quality and security vulnerabilities' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'bkend',
          friendlyName: { ko: 'bkend MCP 서버', en: 'bkend MCP Server' },
          description: { ko: 'bkend.ai 백엔드 서비스 연결', en: 'Connects to bkend.ai backend services' },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['bkend-api-starter'],
    },
    onInstall: {
      message: {
        ko: '백엔드 개발자 Kit 설치 완료! \'/dynamic init\'으로 API를 설계해 보세요.',
        en: "Backend Developer Kit installed! Design your API with '/dynamic init'.",
      },
      suggestedCommand: '/dynamic init',
      guideUrl: 'https://marketplace.bkit.dev/guide/backend-developer-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.3.0',
      node: '>=18.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
    manifest: {
      name: 'backend-developer-kit',
      displayName: { ko: '백엔드 개발자 Kit', en: 'Backend Developer Kit' },
      version: '1.0.2',
      category: 'backend',
      difficulty: 2,
      icon: 'server',
      author: 'bkit-official',
      tags: ['bkend', 'api', 'database', 'rest', 'backend', 'auth'],
      includes: {
        skills: ['bkit:starter', 'bkit:dynamic', 'bkit:phase-4-api', 'bkit:code-review'],
        agents: ['bkit:bkend-expert', 'bkit:code-analyzer'],
        mcpServers: { bkend: { type: 'http', url: 'https://api.bkend.ai/mcp' } },
        templates: ['bkend-api-starter'],
        claudeMd: {
          append: '## Backend Conventions\n- Use bkend.ai Dynamic Level for all data operations\n- Follow RESTful naming conventions\n- Always validate input with Zod schemas\n- Use JWT for authentication',
        },
      },
      onInstall: {
        message: {
          ko: '백엔드 개발자 Kit 설치 완료! \'/dynamic init\'으로 시작하세요.',
          en: "Backend Developer Kit installed! Start with '/dynamic init'.",
        },
        suggestedCommand: '/dynamic init',
        guideUrl: 'https://marketplace.bkit.dev/guide/backend-developer-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.3.0', node: '>=18.0.0' },
    },
  },

  // ─── 4. 풀스택 개발자 Kit ─────────────────────────────────────────────────
  {
    id: 'kit-fullstack-developer',
    name: 'fullstack-developer-kit',
    displayName: {
      ko: '풀스택 개발자 Kit',
      en: 'Full Stack Developer Kit',
    },
    version: '1.0.0',
    description: {
      ko: '웹앱 전체 개발에 필요한 프론트엔드 + 백엔드 도구 통합 Kit. Next.js와 bkend.ai를 결합한 최고의 풀스택 개발 워크플로우를 경험하세요.',
      en: 'Integrated frontend + backend toolkit for full web application development. Experience the best full-stack workflow combining Next.js and bkend.ai.',
    },
    category: 'fullstack',
    difficulty: 3,
    icon: 'layers',
    isOfficial: true,
    author: {
      name: 'bkit Official',
      type: 'official',
      verified: true,
    },
    tags: ['react', 'nextjs', 'bkend', 'fullstack', 'typescript', 'pdca'],
    rating: 4.8,
    reviewCount: 231,
    installCount: 4567,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: '풀스택 프로젝트 초기화', en: 'Initialize full-stack projects' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:dynamic',
          friendlyName: { ko: 'Dynamic API', en: 'Dynamic API' },
          description: { ko: 'bkend.ai Dynamic Level API 구성', en: 'Configure bkend.ai Dynamic Level APIs' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-3-mockup',
          friendlyName: { ko: '목업 생성', en: 'Mockup Generator' },
          description: { ko: 'UI 목업 자동 생성', en: 'Auto-generate UI mockups' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-4-api',
          friendlyName: { ko: 'API 설계', en: 'API Design' },
          description: { ko: 'REST API 엔드포인트 설계', en: 'Design REST API endpoints' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-5-design-system',
          friendlyName: { ko: '디자인 시스템', en: 'Design System' },
          description: { ko: '일관된 디자인 시스템 구축', en: 'Build consistent design systems' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-6-ui-integration',
          friendlyName: { ko: 'UI 통합', en: 'UI Integration' },
          description: { ko: 'UI와 데이터 레이어 통합', en: 'Integrate UI with data layer' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:zero-script-qa',
          friendlyName: { ko: 'QA 자동화', en: 'QA Automation' },
          description: { ko: '스크립트 없이 QA 자동화', en: 'QA automation without scripts' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: '자동화된 코드 품질 검사', en: 'Automated code quality review' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:frontend-architect',
          friendlyName: { ko: '프론트엔드 아키텍트', en: 'Frontend Architect' },
          description: { ko: 'UI/UX 구조 설계 에이전트', en: 'UI/UX architecture design agent' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:bkend-expert',
          friendlyName: { ko: 'bkend 전문가', en: 'bkend Expert' },
          description: { ko: 'bkend.ai 플랫폼 전문 에이전트', en: 'bkend.ai platform expert agent' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:qa-monitor',
          friendlyName: { ko: 'QA 모니터', en: 'QA Monitor' },
          description: { ko: '품질 보증 모니터링 에이전트', en: 'Quality assurance monitoring agent' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:gap-detector',
          friendlyName: { ko: '갭 탐지기', en: 'Gap Detector' },
          description: { ko: '구현 누락 사항을 탐지하는 에이전트', en: 'Agent that detects implementation gaps' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:code-analyzer',
          friendlyName: { ko: '코드 분석기', en: 'Code Analyzer' },
          description: { ko: '코드 품질 및 패턴 분석', en: 'Code quality and pattern analysis' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'bkend',
          friendlyName: { ko: 'bkend MCP 서버', en: 'bkend MCP Server' },
          description: { ko: 'bkend.ai 전체 기능 연결', en: 'Full bkend.ai feature connection' },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['next-app-router', 'design-system-base'],
    },
    onInstall: {
      message: {
        ko: '풀스택 개발자 Kit 설치 완료! \'/starter init\'으로 새 프로젝트를 시작하세요.',
        en: "Full Stack Developer Kit installed! Start a new project with '/starter init'.",
      },
      suggestedCommand: '/starter init',
      guideUrl: 'https://marketplace.bkit.dev/guide/fullstack-developer-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.5.0',
      node: '>=18.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z',
    manifest: {
      name: 'fullstack-developer-kit',
      displayName: { ko: '풀스택 개발자 Kit', en: 'Full Stack Developer Kit' },
      version: '1.0.0',
      category: 'fullstack',
      difficulty: 3,
      icon: 'layers',
      author: 'bkit-official',
      tags: ['react', 'nextjs', 'bkend', 'fullstack', 'typescript', 'pdca'],
      includes: {
        skills: [
          'bkit:starter',
          'bkit:dynamic',
          'bkit:phase-3-mockup',
          'bkit:phase-4-api',
          'bkit:phase-5-design-system',
          'bkit:phase-6-ui-integration',
          'bkit:zero-script-qa',
          'bkit:code-review',
        ],
        agents: [
          'bkit:frontend-architect',
          'bkit:bkend-expert',
          'bkit:qa-monitor',
          'bkit:gap-detector',
          'bkit:code-analyzer',
        ],
        mcpServers: { bkend: { type: 'http', url: 'https://api.bkend.ai/mcp' } },
        templates: ['next-app-router', 'design-system-base'],
        claudeMd: {
          append: '## Full Stack Conventions\n- TypeScript strict mode\n- bkend.ai for backend (BaaS)\n- TanStack Query for data fetching\n- Zustand for state management\n- Tailwind CSS for styling',
        },
      },
      onInstall: {
        message: {
          ko: '풀스택 개발자 Kit 설치 완료! \'/starter init\'으로 시작하세요.',
          en: "Full Stack Developer Kit installed! Start with '/starter init'.",
        },
        suggestedCommand: '/starter init',
        guideUrl: 'https://marketplace.bkit.dev/guide/fullstack-developer-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.5.0', node: '>=18.0.0' },
    },
  },

  // ─── 5. DevOps 엔지니어 Kit ───────────────────────────────────────────────
  {
    id: 'kit-devops-engineer',
    name: 'devops-engineer-kit',
    displayName: {
      ko: 'DevOps 엔지니어 Kit',
      en: 'DevOps Engineer Kit',
    },
    version: '1.0.1',
    description: {
      ko: 'CI/CD 파이프라인 구축, Docker 컨테이너화, 클라우드 배포 자동화를 위한 전문가 Kit. GitHub Actions, Vercel, AWS 연동을 지원합니다.',
      en: 'Expert Kit for CI/CD pipeline setup, Docker containerization, and cloud deployment automation. Supports GitHub Actions, Vercel, and AWS integrations.',
    },
    category: 'devops',
    difficulty: 3,
    icon: 'rocket',
    isOfficial: true,
    author: {
      name: 'bkit Official',
      type: 'official',
      verified: true,
    },
    tags: ['cicd', 'docker', 'github-actions', 'vercel', 'aws', 'devops'],
    rating: 4.3,
    reviewCount: 78,
    installCount: 1432,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: 'DevOps 프로젝트 구조 초기화', en: 'Initialize DevOps project structure' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:zero-script-qa',
          friendlyName: { ko: 'QA 자동화', en: 'QA Automation' },
          description: { ko: '파이프라인에 QA 자동화 통합', en: 'Integrate QA automation into pipelines' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: 'CI에서 자동 코드 리뷰', en: 'Automated code review in CI' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:qa-monitor',
          friendlyName: { ko: 'QA 모니터', en: 'QA Monitor' },
          description: { ko: '지속적인 품질 모니터링', en: 'Continuous quality monitoring' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:gap-detector',
          friendlyName: { ko: '갭 탐지기', en: 'Gap Detector' },
          description: { ko: '인프라 갭과 보안 취약점 탐지', en: 'Detect infrastructure gaps and security vulnerabilities' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'bkend',
          friendlyName: { ko: 'bkend MCP 서버', en: 'bkend MCP Server' },
          description: { ko: 'bkend.ai 배포 연동', en: 'bkend.ai deployment integration' },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['github-actions-workflow', 'dockerfile-node'],
    },
    onInstall: {
      message: {
        ko: 'DevOps 엔지니어 Kit 설치 완료! \'/pdca plan\'으로 배포 계획을 세워보세요.',
        en: "DevOps Engineer Kit installed! Plan your deployment with '/pdca plan'.",
      },
      suggestedCommand: '/pdca plan',
      guideUrl: 'https://marketplace.bkit.dev/guide/devops-engineer-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.4.0',
      node: '>=18.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-12T00:00:00Z',
    manifest: {
      name: 'devops-engineer-kit',
      displayName: { ko: 'DevOps 엔지니어 Kit', en: 'DevOps Engineer Kit' },
      version: '1.0.1',
      category: 'devops',
      difficulty: 3,
      icon: 'rocket',
      author: 'bkit-official',
      tags: ['cicd', 'docker', 'github-actions', 'vercel', 'aws', 'devops'],
      includes: {
        skills: ['bkit:starter', 'bkit:zero-script-qa', 'bkit:code-review'],
        agents: ['bkit:qa-monitor', 'bkit:gap-detector'],
        mcpServers: { bkend: { type: 'http', url: 'https://api.bkend.ai/mcp' } },
        templates: ['github-actions-workflow', 'dockerfile-node'],
        claudeMd: {
          append: '## DevOps Conventions\n- Always containerize with Docker\n- Use GitHub Actions for CI/CD\n- Deploy via Vercel (frontend) or bkend.ai (backend)\n- Never commit secrets — use environment variables',
        },
      },
      onInstall: {
        message: {
          ko: 'DevOps 엔지니어 Kit 설치 완료! \'/pdca plan\'으로 시작하세요.',
          en: "DevOps Engineer Kit installed! Start with '/pdca plan'.",
        },
        suggestedCommand: '/pdca plan',
        guideUrl: 'https://marketplace.bkit.dev/guide/devops-engineer-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.4.0', node: '>=18.0.0' },
    },
  },

  // ─── 6. 모바일 앱 개발 Kit (Community) ────────────────────────────────────
  {
    id: 'kit-mobile-app',
    name: 'mobile-app-kit',
    displayName: {
      ko: '모바일 앱 개발 Kit',
      en: 'Mobile App Development Kit',
    },
    version: '0.9.2',
    description: {
      ko: 'React Native와 Expo를 사용하여 iOS와 Android 앱을 동시에 개발하는 Kit. 커뮤니티가 검증한 최고의 모바일 개발 워크플로우를 제공합니다.',
      en: 'A Kit for simultaneously developing iOS and Android apps with React Native and Expo. Provides the best community-validated mobile development workflow.',
    },
    category: 'mobile',
    difficulty: 2,
    icon: 'smartphone',
    isOfficial: false,
    author: {
      name: '김모바일',
      type: 'community',
      verified: true,
    },
    tags: ['react-native', 'expo', 'mobile', 'ios', 'android', 'typescript'],
    rating: 4.2,
    reviewCount: 54,
    installCount: 987,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: 'Expo 프로젝트 초기화', en: 'Initialize Expo projects' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-3-mockup',
          friendlyName: { ko: '목업 생성', en: 'Mockup Generator' },
          description: { ko: '모바일 화면 목업 생성', en: 'Generate mobile screen mockups' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: 'React Native 코드 품질 검사', en: 'React Native code quality review' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:frontend-architect',
          friendlyName: { ko: '프론트엔드 아키텍트', en: 'Frontend Architect' },
          description: { ko: '모바일 UI 구조 설계', en: 'Mobile UI architecture design' },
          technicalType: 'agent',
        },
        {
          id: 'bkit:code-analyzer',
          friendlyName: { ko: '코드 분석기', en: 'Code Analyzer' },
          description: { ko: '모바일 앱 코드 분석', en: 'Mobile app code analysis' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [],
      templates: ['expo-router-tabs', 'expo-blank'],
    },
    onInstall: {
      message: {
        ko: '모바일 앱 개발 Kit 설치 완료! \'/starter init\'으로 앱을 만들어 보세요.',
        en: "Mobile App Development Kit installed! Build your app with '/starter init'.",
      },
      suggestedCommand: '/starter init',
      guideUrl: 'https://marketplace.bkit.dev/guide/mobile-app-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.2.0',
      node: '>=18.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-08T00:00:00Z',
    manifest: {
      name: 'mobile-app-kit',
      displayName: { ko: '모바일 앱 개발 Kit', en: 'Mobile App Development Kit' },
      version: '0.9.2',
      category: 'mobile',
      difficulty: 2,
      icon: 'smartphone',
      author: 'kim-mobile',
      tags: ['react-native', 'expo', 'mobile', 'ios', 'android', 'typescript'],
      includes: {
        skills: ['bkit:starter', 'bkit:phase-3-mockup', 'bkit:code-review'],
        agents: ['bkit:frontend-architect', 'bkit:code-analyzer'],
        mcpServers: {},
        templates: ['expo-router-tabs', 'expo-blank'],
        claudeMd: {
          append: '## Mobile Conventions\n- Use Expo Router for navigation\n- NativeWind for styling (Tailwind for RN)\n- Zustand for state management\n- React Query for server state',
        },
      },
      onInstall: {
        message: {
          ko: '모바일 앱 개발 Kit 설치 완료! \'/starter init\'으로 시작하세요.',
          en: "Mobile App Development Kit installed! Start with '/starter init'.",
        },
        suggestedCommand: '/starter init',
        guideUrl: 'https://marketplace.bkit.dev/guide/mobile-app-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.2.0', node: '>=18.0.0' },
    },
  },

  // ─── 7. 데이터 분석 Kit (Community) ──────────────────────────────────────
  {
    id: 'kit-data-analysis',
    name: 'data-analysis-kit',
    displayName: {
      ko: '데이터 분석 Kit',
      en: 'Data Analysis Kit',
    },
    version: '1.0.0',
    description: {
      ko: 'Python과 Jupyter Notebook으로 데이터를 수집, 정제, 분석, 시각화하는 전체 파이프라인을 구축하세요. pandas, matplotlib, seaborn 등의 핵심 라이브러리 활용 가이드를 포함합니다.',
      en: 'Build a complete data pipeline for collection, cleaning, analysis, and visualization with Python and Jupyter Notebook. Includes guides for pandas, matplotlib, seaborn, and other key libraries.',
    },
    category: 'data',
    difficulty: 2,
    icon: 'bar-chart',
    isOfficial: false,
    author: {
      name: '이데이터',
      type: 'community',
      verified: true,
    },
    tags: ['python', 'pandas', 'jupyter', 'matplotlib', 'data-science', 'analytics'],
    rating: 4.5,
    reviewCount: 66,
    installCount: 1203,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: '데이터 분석 프로젝트 초기화', en: 'Initialize data analysis projects' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:code-review',
          friendlyName: { ko: '코드 리뷰', en: 'Code Review' },
          description: { ko: 'Python 데이터 코드 품질 검사', en: 'Python data code quality review' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:code-analyzer',
          friendlyName: { ko: '코드 분석기', en: 'Code Analyzer' },
          description: { ko: '데이터 처리 코드 최적화 제안', en: 'Suggests data processing code optimizations' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [
        {
          id: 'jupyter-mcp',
          friendlyName: { ko: 'Jupyter MCP', en: 'Jupyter MCP' },
          description: { ko: 'Jupyter Notebook과 Claude를 연결', en: 'Connects Jupyter Notebook with Claude' },
          technicalType: 'mcp_server',
        },
      ],
      templates: ['jupyter-eda-template', 'python-data-pipeline'],
    },
    onInstall: {
      message: {
        ko: '데이터 분석 Kit 설치 완료! \'/analyze start\'로 데이터 분석을 시작하세요.',
        en: "Data Analysis Kit installed! Start analyzing data with '/analyze start'.",
      },
      suggestedCommand: '/analyze start',
      guideUrl: 'https://marketplace.bkit.dev/guide/data-analysis-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
      bkit: '>=1.1.0',
    },
    status: 'approved',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-19T00:00:00Z',
    manifest: {
      name: 'data-analysis-kit',
      displayName: { ko: '데이터 분석 Kit', en: 'Data Analysis Kit' },
      version: '1.0.0',
      category: 'data',
      difficulty: 2,
      icon: 'bar-chart',
      author: 'lee-data',
      tags: ['python', 'pandas', 'jupyter', 'matplotlib', 'data-science', 'analytics'],
      includes: {
        skills: ['bkit:starter', 'bkit:code-review'],
        agents: ['bkit:code-analyzer'],
        mcpServers: {
          'jupyter-mcp': {
            command: 'uvx',
            args: ['jupyter-mcp-server'],
          },
        },
        templates: ['jupyter-eda-template', 'python-data-pipeline'],
        claudeMd: {
          append: '## Data Analysis Conventions\n- Use pandas for data manipulation\n- matplotlib/seaborn for visualization\n- Always validate data quality before analysis\n- Document findings in Jupyter notebooks',
        },
      },
      onInstall: {
        message: {
          ko: '데이터 분석 Kit 설치 완료! \'/analyze start\'로 시작하세요.',
          en: "Data Analysis Kit installed! Start with '/analyze start'.",
        },
        suggestedCommand: '/analyze start',
        guideUrl: 'https://marketplace.bkit.dev/guide/data-analysis-kit',
      },
      requires: { claudeCode: '>=1.0.0', bkit: '>=1.1.0' },
    },
  },

  // ─── 8. 학생/입문자 Kit (Community) ──────────────────────────────────────
  {
    id: 'kit-student-starter',
    name: 'student-starter-kit',
    displayName: {
      ko: '학생/입문자 Kit',
      en: 'Student Starter Kit',
    },
    version: '1.3.0',
    description: {
      ko: '프로그래밍을 처음 배우는 학생과 입문자를 위한 Kit. HTML, CSS, JavaScript 기초부터 시작하여 첫 번째 웹사이트를 완성할 수 있도록 단계별로 안내합니다.',
      en: 'A Kit for students and beginners learning programming for the first time. Guides you step by step from HTML, CSS, JavaScript basics to completing your first website.',
    },
    category: 'website',
    difficulty: 1,
    icon: 'graduation-cap',
    isOfficial: false,
    author: {
      name: '박티처',
      type: 'community',
      verified: false,
    },
    tags: ['beginner', 'student', 'html', 'css', 'javascript', 'tutorial'],
    rating: 4.9,
    reviewCount: 423,
    installCount: 7821,
    includes: {
      skills: [
        {
          id: 'bkit:starter',
          friendlyName: { ko: '프로젝트 시작', en: 'Project Starter' },
          description: { ko: '입문자용 프로젝트 초기화', en: 'Beginner-friendly project initialization' },
          technicalType: 'skill',
        },
        {
          id: 'bkit:phase-3-mockup',
          friendlyName: { ko: '목업 생성', en: 'Mockup Generator' },
          description: { ko: '간단한 UI 목업 생성', en: 'Create simple UI mockups' },
          technicalType: 'skill',
        },
      ],
      agents: [
        {
          id: 'bkit:frontend-architect',
          friendlyName: { ko: '프론트엔드 아키텍트', en: 'Frontend Architect' },
          description: { ko: '초보자를 위한 UI 가이드', en: 'UI guidance for beginners' },
          technicalType: 'agent',
        },
      ],
      mcpServers: [],
      templates: ['html-css-starter', 'vanilla-js-todo'],
    },
    onInstall: {
      message: {
        ko: '학생/입문자 Kit 설치 완료! \'/starter init\'으로 첫 웹사이트를 만들어보세요.',
        en: "Student Starter Kit installed! Build your first website with '/starter init'.",
      },
      suggestedCommand: '/starter init',
      guideUrl: 'https://marketplace.bkit.dev/guide/student-starter-kit',
    },
    requires: {
      claudeCode: '>=1.0.0',
    },
    status: 'approved',
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-02-22T00:00:00Z',
    manifest: {
      name: 'student-starter-kit',
      displayName: { ko: '학생/입문자 Kit', en: 'Student Starter Kit' },
      version: '1.3.0',
      category: 'website',
      difficulty: 1,
      icon: 'graduation-cap',
      author: 'park-teacher',
      tags: ['beginner', 'student', 'html', 'css', 'javascript', 'tutorial'],
      includes: {
        skills: ['bkit:starter', 'bkit:phase-3-mockup'],
        agents: ['bkit:frontend-architect'],
        mcpServers: {},
        templates: ['html-css-starter', 'vanilla-js-todo'],
        claudeMd: {
          append: '## Beginner Conventions\n- Start with vanilla HTML/CSS/JS\n- Use simple, clear variable names\n- Comment every function explaining what it does\n- No frameworks until basics are solid',
        },
      },
      onInstall: {
        message: {
          ko: '학생/입문자 Kit 설치 완료! \'/starter init\'으로 시작하세요.',
          en: "Student Starter Kit installed! Start with '/starter init'.",
        },
        suggestedCommand: '/starter init',
        guideUrl: 'https://marketplace.bkit.dev/guide/student-starter-kit',
      },
      requires: { claudeCode: '>=1.0.0' },
    },
  },
];
