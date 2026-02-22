import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    categoryId: 'website',
    name: { ko: '웹사이트 제작', en: 'Website Builder' },
    icon: 'globe',
    order: 1,
    description: {
      ko: '코딩 없이 전문적인 웹사이트를 빠르게 제작',
      en: 'Build professional websites quickly without coding',
    },
    kitCount: 2,
  },
  {
    categoryId: 'frontend',
    name: { ko: '프론트엔드', en: 'Frontend' },
    icon: 'layout',
    order: 2,
    description: {
      ko: 'React, Vue 등 프론트엔드 개발 도구 모음',
      en: 'Frontend development tools for React, Vue, and more',
    },
    kitCount: 1,
  },
  {
    categoryId: 'backend',
    name: { ko: '백엔드', en: 'Backend' },
    icon: 'server',
    order: 3,
    description: {
      ko: 'API 서버, 데이터베이스 설계 및 개발 도구',
      en: 'API servers, database design, and backend development tools',
    },
    kitCount: 1,
  },
  {
    categoryId: 'fullstack',
    name: { ko: '풀스택', en: 'Full Stack' },
    icon: 'layers',
    order: 4,
    description: {
      ko: '프론트엔드 + 백엔드 통합 개발 환경',
      en: 'Integrated frontend and backend development environment',
    },
    kitCount: 1,
  },
  {
    categoryId: 'devops',
    name: { ko: 'DevOps', en: 'DevOps' },
    icon: 'rocket',
    order: 5,
    description: {
      ko: 'CI/CD, 컨테이너, 클라우드 인프라 자동화',
      en: 'CI/CD, containers, and cloud infrastructure automation',
    },
    kitCount: 1,
  },
  {
    categoryId: 'mobile',
    name: { ko: '모바일', en: 'Mobile' },
    icon: 'smartphone',
    order: 6,
    description: {
      ko: 'iOS, Android 및 크로스 플랫폼 앱 개발',
      en: 'iOS, Android, and cross-platform app development',
    },
    kitCount: 1,
  },
  {
    categoryId: 'data',
    name: { ko: '데이터 분석', en: 'Data Analysis' },
    icon: 'bar-chart',
    order: 7,
    description: {
      ko: '데이터 수집, 분석, 시각화 도구 모음',
      en: 'Data collection, analysis, and visualization tools',
    },
    kitCount: 1,
  },
  {
    categoryId: 'content',
    name: { ko: '콘텐츠 제작', en: 'Content Creation' },
    icon: 'edit',
    order: 8,
    description: {
      ko: '블로그, 마케팅, 기술 문서 작성 도구',
      en: 'Tools for blogs, marketing, and technical documentation',
    },
    kitCount: 0,
  },
];
