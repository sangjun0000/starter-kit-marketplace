'use client';

import { Loader2, Check, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn, localize } from '@/lib/utils';
import type { InstallState, LocalizedString } from '@/types';

interface InstallButtonProps {
  kitId: string;
  kitName: LocalizedString;
  state: InstallState;
  onInstall: () => void;
  onUpdate?: () => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  locale: 'ko' | 'en';
  className?: string;
}

interface ButtonConfig {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant: 'primary' | 'secondary' | 'success' | 'destructive' | 'outline';
  disabled: boolean;
  spin?: boolean;
}

function getButtonConfig(state: InstallState, labels: Record<string, string>): ButtonConfig {
  switch (state) {
    case 'idle':
      return { label: labels.install, icon: Download, variant: 'primary', disabled: false };
    case 'confirming':
    case 'generating':
      return { label: labels.install + '...', icon: Loader2, variant: 'primary', disabled: true, spin: true };
    case 'ready':
      return { label: labels.install, icon: Download, variant: 'primary', disabled: false };
    case 'installing':
      return { label: labels.install + '...', icon: Loader2, variant: 'secondary', disabled: true, spin: true };
    case 'verifying':
      return { label: labels.install + '...', icon: Loader2, variant: 'secondary', disabled: true, spin: true };
    case 'success':
      return { label: labels.installed + '!', icon: Check, variant: 'success', disabled: false };
    case 'error':
      return { label: labels.error, icon: AlertCircle, variant: 'destructive', disabled: false };
    default:
      return { label: labels.install, icon: Download, variant: 'primary', disabled: false };
  }
}

const SIZE_CLASSES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base font-semibold',
};

const VARIANT_CLASSES = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400 disabled:opacity-60',
  success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
};

export function InstallButton({
  kitId,
  kitName,
  state,
  onInstall,
  onUpdate,
  size = 'md',
  fullWidth = false,
  locale,
  className,
}: InstallButtonProps) {
  const t = useTranslations('kit');
  const labels = {
    install: t('install'),
    installed: t('installed'),
    update: t('update'),
    error: locale === 'ko' ? '다시 시도' : 'Try Again',
  };
  const config = getButtonConfig(state, labels);
  const Icon = config.icon;
  const name = localize(kitName, locale);

  const handleClick = () => {
    if (config.disabled) return;
    if (state === 'error' || state === 'idle' || state === 'ready') {
      onInstall();
    } else if (state === 'success' && onUpdate) {
      onUpdate();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={config.disabled}
      aria-label={`${name} ${config.label}`}
      aria-busy={config.spin}
      data-kit-id={kitId}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[config.variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
            config.spin && 'animate-spin',
          )}
          aria-hidden="true"
        />
      )}
      {config.label}
    </button>
  );
}
