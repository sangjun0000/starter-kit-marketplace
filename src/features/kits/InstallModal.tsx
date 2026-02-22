'use client';

import { useEffect, useRef } from 'react';
import { X, Terminal, ExternalLink, Zap } from 'lucide-react';
import { cn, localize } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import type { KitDetail, InstallSession } from '@/types';

interface InstallModalProps {
  kit: KitDetail;
  session: InstallSession | null;
  isOpen: boolean;
  onClose: () => void;
  onDeeplinkLaunch: () => void;
  onCliCopy: () => void;
  locale: 'ko' | 'en';
}

export function InstallModal({
  kit,
  session,
  isOpen,
  onClose,
  onDeeplinkLaunch,
  onCliCopy,
  locale,
}: InstallModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const kitName = localize(kit.displayName, locale);

  const t = locale === 'ko'
    ? {
        title: `${kitName} 설치하기`,
        chooseMethod: '설치 방법을 선택하세요',
        deeplink: 'Claude Code로 자동 설치 (권장)',
        deeplinkDesc: 'Claude Code가 설치된 경우 클릭하면 바로 설치됩니다.',
        deeplinkBtn: 'Claude Code로 열기',
        orDivider: '또는',
        cli: '터미널 명령어 복사',
        cliDesc: 'Claude Code 터미널에서 직접 실행하려면',
        noClaudeCode: '아직 Claude Code가 없으신가요?',
        installGuide: '설치 방법 보기',
        close: '닫기',
        loading: '설치 세션 생성 중...',
      }
    : {
        title: `Install ${kitName}`,
        chooseMethod: 'Choose how to install',
        deeplink: 'Auto Install via Claude Code (Recommended)',
        deeplinkDesc: 'If Claude Code is installed, click to install automatically.',
        deeplinkBtn: 'Open in Claude Code',
        orDivider: 'or',
        cli: 'Copy Terminal Command',
        cliDesc: 'Run directly in your Claude Code terminal',
        noClaudeCode: "Don't have Claude Code yet?",
        installGuide: 'See installation guide',
        close: 'Close',
        loading: 'Creating install session...',
      };

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => closeButtonRef.current?.focus(), 50);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      aria-describedby="install-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full bg-white shadow-xl',
        'sm:max-w-lg sm:rounded-2xl',
        'rounded-t-2xl sm:rounded-t-2xl',
        'max-h-[90vh] overflow-y-auto',
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2
            id="install-modal-title"
            className="text-lg font-semibold text-slate-900"
          >
            {t.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p
            id="install-modal-desc"
            className="text-sm text-slate-500"
          >
            {t.chooseMethod}
          </p>

          {!session ? (
            <div className="flex items-center justify-center py-8 text-slate-400 gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
              <span className="text-sm">{t.loading}</span>
            </div>
          ) : (
            <>
              {/* Option A: Deeplink */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t.deeplink}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.deeplinkDesc}</p>
                  </div>
                </div>
                <a
                  href={session.deeplink}
                  onClick={onDeeplinkLaunch}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3',
                    'text-sm font-semibold text-white hover:bg-blue-700 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                    'min-h-[48px]',
                  )}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {t.deeplinkBtn}
                </a>
              </div>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-slate-200" />
                <span className="px-3 text-xs text-slate-400">{t.orDivider}</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              {/* Option B: CLI */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white">
                    <Terminal className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{t.cli}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.cliDesc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5">
                  <code className="flex-1 font-mono text-xs text-green-400 break-all">
                    {session.cliCommand}
                  </code>
                  <CopyButton
                    text={session.cliCommand}
                    locale={locale}
                    size="sm"
                    onCopied={onCliCopy}
                    className="shrink-0 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* No Claude Code link */}
          <p className="text-center text-xs text-slate-400">
            {t.noClaudeCode}{' '}
            <a
              href="https://docs.anthropic.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              {t.installGuide}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
