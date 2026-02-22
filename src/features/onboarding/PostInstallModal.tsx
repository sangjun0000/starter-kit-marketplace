'use client';

import { useEffect, useRef } from 'react';
import { X, CheckCircle, ExternalLink, Terminal } from 'lucide-react';
import { cn, localize } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import type { KitDetail } from '@/types';

interface PostInstallModalProps {
  kit: KitDetail;
  isOpen: boolean;
  onClose: () => void;
  locale: 'ko' | 'en';
}

export function PostInstallModal({ kit, isOpen, onClose, locale }: PostInstallModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const kitName = localize(kit.displayName, locale);
  const installMessage = localize(kit.onInstall.message, locale);

  const t = locale === 'ko'
    ? {
        title: '설치 완료!',
        subtitle: `${kitName}이(가) 설치되었습니다.`,
        nextSteps: '다음 단계',
        runCommand: '아래 명령어를 Claude Code에서 실행하세요:',
        guide: '시작 가이드 보기',
        close: '닫기',
        myKits: '내 Kit 보기',
      }
    : {
        title: 'Installation Complete!',
        subtitle: `${kitName} has been installed.`,
        nextSteps: 'Next Steps',
        runCommand: 'Run this command in Claude Code:',
        guide: 'View Getting Started Guide',
        close: 'Close',
        myKits: 'View My Kits',
      };

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
      aria-labelledby="post-install-title"
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
        'sm:max-w-md sm:rounded-2xl',
        'rounded-t-2xl',
        'max-h-[90vh] overflow-y-auto',
      )}>
        {/* Header */}
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Success Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h2 id="post-install-title" className="text-xl font-bold text-slate-900">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Install message */}
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-sm text-green-800 leading-relaxed">{installMessage}</p>
          </div>

          {/* Suggested command */}
          {kit.onInstall.suggestedCommand && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                <Terminal className="inline h-4 w-4 mr-1.5 text-slate-400" aria-hidden="true" />
                {t.runCommand}
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3">
                <code className="flex-1 font-mono text-sm text-green-400 break-all">
                  {kit.onInstall.suggestedCommand}
                </code>
                <CopyButton
                  text={kit.onInstall.suggestedCommand}
                  locale={locale}
                  size="sm"
                  className="shrink-0 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                />
              </div>
            </div>
          )}

          {/* Guide link */}
          {kit.onInstall.guideUrl && (
            <a
              href={kit.onInstall.guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50',
                'px-4 py-3 text-sm font-medium text-blue-700',
                'hover:bg-blue-100 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                'min-h-[48px]',
              )}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {t.guide}
            </a>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600',
              'hover:bg-slate-50 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              'min-h-[48px]',
            )}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
