'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TechnicalTerm = 'mcp_server' | 'skill' | 'agent' | 'plugin' | 'claude_md' | 'template';

interface FriendlyTermBadgeProps {
  term: TechnicalTerm;
  locale?: 'ko' | 'en';
  showTooltip?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const TERM_MAP: Record<TechnicalTerm, { ko: string; en: string; technical: string }> = {
  mcp_server: { ko: '서버 연결', en: 'Server Connection', technical: 'MCP Server' },
  skill: { ko: '기능', en: 'Feature', technical: 'Skill' },
  agent: { ko: 'AI 어시스턴트', en: 'AI Assistant', technical: 'Agent' },
  plugin: { ko: '확장 기능', en: 'Extension', technical: 'Plugin' },
  claude_md: { ko: '프로젝트 설정', en: 'Project Config', technical: 'CLAUDE.md' },
  template: { ko: '프로젝트 템플릿', en: 'Project Template', technical: 'Template' },
};

export function FriendlyTermBadge({
  term,
  locale = 'ko',
  showTooltip = true,
  size = 'sm',
  className,
}: FriendlyTermBadgeProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const termData = TERM_MAP[term];
  const displayName = locale === 'ko' ? termData.ko : termData.en;

  return (
    <span className={cn('relative inline-flex items-center gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-center rounded-full border border-slate-200 bg-slate-100 font-medium text-slate-700',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        )}
      >
        {displayName}
      </span>

      {showTooltip && (
        <button
          type="button"
          className="inline-flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          aria-label={locale === 'ko' ? `${displayName} 설명 보기` : `View ${displayName} description`}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onFocus={() => setTooltipVisible(true)}
          onBlur={() => setTooltipVisible(false)}
        >
          <HelpCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
        </button>
      )}

      {showTooltip && tooltipVisible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-1 min-w-max rounded bg-slate-800 px-2 py-1 text-xs text-white shadow-lg"
        >
          {locale === 'ko' ? '기술 명칭' : 'Technical name'}: {termData.technical}
        </span>
      )}
    </span>
  );
}
