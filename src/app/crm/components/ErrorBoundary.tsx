'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useToastApi } from '../hooks/useToast';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('ErrorBoundary');

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Erro capturado', error, { componentStack: errorInfo.componentStack });
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <ErrorFallback error={this.state.error} title={this.props.fallbackTitle} onReset={this.handleReset} />;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  title?: string;
  onReset: () => void;
}

function ErrorFallback({ error, title, onReset }: ErrorFallbackProps) {
  return (
    <div className="mx-auto my-8 max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-300">
          <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div className="flex-1 space-y-2">
          <h3 className="font-display text-base font-bold text-white">
            {title ?? 'Algo deu errado nesta seção'}
          </h3>
          <p className="text-xs text-white/65">
            A página encontrou um erro inesperado. Os dados do seu CRM continuam seguros.
          </p>
          {error?.message && (
            <details className="mt-2 rounded-lg border border-white/5 bg-[#04080f]/60 p-3 text-[11px] text-white/55">
              <summary className="cursor-pointer font-semibold text-white/75">Detalhes técnicos</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[10px] text-red-200/80">
                {error.message}
              </pre>
            </details>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1.5 text-xs font-bold text-[#f5d77a] transition hover:bg-[#c9a227]/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tentar novamente
            </button>
            <a
              href="/crm"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/75 transition hover:bg-white/10"
            >
              Recarregar CRM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TabErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

export function TabErrorBoundary({ children, fallbackTitle }: TabErrorBoundaryProps) {
  const toast = useToastApi();

  return (
    <ErrorBoundary
      fallbackTitle={fallbackTitle}
      onError={(error) => toast.error(`Erro em ${fallbackTitle ?? 'uma seção'}: ${error.message}`)}
    >
      {children}
    </ErrorBoundary>
  );
}
