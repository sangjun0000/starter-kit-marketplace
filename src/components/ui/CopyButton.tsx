'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  locale?: 'ko' | 'en';
  size?: 'sm' | 'md';
  variant?: 'icon' | 'text' | 'both';
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({
  text,
  locale = 'ko',
  size = 'md',
  variant = 'both',
  className,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copiedLabel = locale === 'ko' ? '복사됨!' : 'Copied!';
  const copyLabel = locale === 'ko' ? '복사' : 'Copy';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        'inline-flex items-center gap-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        copied
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
        className,
      )}
    >
      {copied ? (
        <Check className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
      ) : (
        <Copy className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
      )}
      {variant !== 'icon' && (
        <span>{copied ? copiedLabel : copyLabel}</span>
      )}
    </button>
  );
}
