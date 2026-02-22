export interface LocalizedString {
  ko?: string;
  en: string;
}

export type KitCategory =
  | 'website'
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'devops'
  | 'mobile'
  | 'data'
  | 'content';

export type KitDifficulty = 1 | 2 | 3;

export type KitType = 'official' | 'community';

export type KitStatus = 'pending' | 'approved' | 'rejected' | 'deprecated';

export interface KitSummary {
  id: string;
  name: string;
  displayName: LocalizedString;
  description: LocalizedString;
  category: KitCategory;
  difficulty: KitDifficulty;
  icon: string;
  author: {
    name: string;
    type: KitType;
    verified: boolean;
  };
  isOfficial: boolean;
  version: string;
  rating: number;
  reviewCount: number;
  installCount: number;
  tags: string[];
}

export interface KitTool {
  id: string;
  friendlyName: LocalizedString;
  description: LocalizedString;
  technicalType: 'skill' | 'agent' | 'mcp_server' | 'template';
}

export interface KitDetail extends KitSummary {
  includes: {
    skills: KitTool[];
    agents: KitTool[];
    mcpServers: KitTool[];
    templates: string[];
  };
  onInstall: {
    message: LocalizedString;
    suggestedCommand: string;
    guideUrl?: string;
  };
  requires: {
    claudeCode?: string;
    bkit?: string;
    node?: string;
  };
}

export interface InstallSession {
  installationId: string;
  verificationToken: string;
  deeplink: string;
  cliCommand: string;
  expiresAt: string;
}

export type InstallState =
  | 'idle'
  | 'confirming'
  | 'generating'
  | 'ready'
  | 'installing'
  | 'verifying'
  | 'success'
  | 'error'
  | 'loading'
  | 'modal_open'
  | 'deeplink_launched'
  | 'cli_copied'
  | 'installed'
  | 'update_available';

export interface KitListParams {
  category?: KitCategory;
  difficulty?: KitDifficulty;
  type?: KitType;
  tags?: string[];
  search?: string;
  sort?: 'popular' | 'newest' | 'rating' | 'updated' | 'name';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
