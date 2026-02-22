'use client';

import { useState } from 'react';
import { Wrench, Bot, Globe, FileText } from 'lucide-react';
import { cn, localize } from '@/lib/utils';
import { FriendlyTermBadge } from '@/components/ui/FriendlyTermBadge';
import type { KitTool } from '@/types';

interface KitToolListProps {
  tools: {
    skills: KitTool[];
    agents: KitTool[];
    mcpServers: KitTool[];
    templates: string[];
  };
  locale: 'ko' | 'en';
}

type TabKey = 'skills' | 'agents' | 'mcpServers' | 'templates';

export function KitToolList({ tools, locale }: KitToolListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (tools.skills.length > 0) return 'skills';
    if (tools.agents.length > 0) return 'agents';
    if (tools.mcpServers.length > 0) return 'mcpServers';
    return 'templates';
  });

  const t = locale === 'ko'
    ? { skills: '기능', agents: 'AI 어시스턴트', mcpServers: '서버 연결', templates: '템플릿' }
    : { skills: 'Features', agents: 'AI Assistants', mcpServers: 'Server Connections', templates: 'Templates' };

  const allTabs: { key: TabKey; label: string; count: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'skills' as TabKey, label: t.skills, count: tools.skills.length, icon: Wrench },
    { key: 'agents' as TabKey, label: t.agents, count: tools.agents.length, icon: Bot },
    { key: 'mcpServers' as TabKey, label: t.mcpServers, count: tools.mcpServers.length, icon: Globe },
    { key: 'templates' as TabKey, label: t.templates, count: tools.templates.length, icon: FileText },
  ];
  const tabs = allTabs.filter((tab) => tab.count > 0);

  const termMap: Record<TabKey, 'skill' | 'agent' | 'mcp_server' | 'template'> = {
    skills: 'skill',
    agents: 'agent',
    mcpServers: 'mcp_server',
    templates: 'template',
  };

  return (
    <div>
      {/* Tab Bar */}
      <div
        className="flex gap-1 border-b border-slate-200 overflow-x-auto"
        role="tablist"
        aria-label={locale === 'ko' ? '도구 목록 탭' : 'Tools tab list'}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-controls={`panel-${tab.key}`}
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
              <span
                className={cn(
                  'ml-0.5 rounded-full px-1.5 py-0.5 text-xs',
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {(activeTab === 'skills' || activeTab === 'agents' || activeTab === 'mcpServers') && (
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="py-4"
        >
          <ul className="space-y-3">
            {(tools[activeTab] as KitTool[]).map((tool) => (
              <li
                key={tool.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900 text-sm">
                      {localize(tool.friendlyName, locale)}
                    </span>
                    <FriendlyTermBadge
                      term={termMap[activeTab]}
                      locale={locale}
                      showTooltip
                      size="sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {localize(tool.description, locale)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'templates' && (
        <div
          role="tabpanel"
          id="panel-templates"
          aria-labelledby="tab-templates"
          className="py-4"
        >
          <ul className="space-y-2">
            {tools.templates.map((template, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <code className="text-sm text-slate-700 font-mono">{template}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
