type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error | unknown;
  timestamp: string;
  scope?: string;
}

const isProduction = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }
  return false;
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = isProduction() ? 'warn' : 'debug';

const shouldLog = (level: LogLevel): boolean => LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];

const formatPayload = (payload: LogPayload): string => {
  const parts = [
    `[${payload.timestamp}]`,
    `[${payload.level.toUpperCase()}]`,
    payload.scope ? `[${payload.scope}]` : '',
    payload.message,
  ].filter(Boolean);
  return parts.join(' ');
};

const emit = (payload: LogPayload): void => {
  if (!shouldLog(payload.level)) return;

  const line = formatPayload(payload);

  if (typeof window !== 'undefined' && typeof window.console !== 'undefined') {
    const consoleMethod =
      payload.level === 'error'
        ? window.console.error
        : payload.level === 'warn'
          ? window.console.warn
          : payload.level === 'info'
            ? window.console.info
            : window.console.debug;

    if (payload.error !== undefined) {
      consoleMethod(line, payload.context ?? '', payload.error);
    } else if (payload.context !== undefined) {
      consoleMethod(line, payload.context);
    } else {
      consoleMethod(line);
    }
    return;
  }

  if (typeof process !== 'undefined' && process.stdout) {
    const stream = payload.level === 'error' || payload.level === 'warn' ? process.stderr : process.stdout;
    stream.write(`${line}\n`);
  }
};

export interface Logger {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, error?: Error | unknown, context?: LogContext) => void;
  child: (scope: string) => Logger;
}

const createLogger = (scope?: string): Logger => {
  const build = (level: LogLevel, message: string, extra?: { error?: Error | unknown; context?: LogContext }): void => {
    emit({
      level,
      message,
      context: extra?.context,
      error: extra?.error,
      timestamp: new Date().toISOString(),
      scope,
    });
  };

  return {
    debug: (message, context) => build('debug', message, { context }),
    info: (message, context) => build('info', message, { context }),
    warn: (message, context) => build('warn', message, { context }),
    error: (message, error, context) => build('error', message, { error, context }),
    child: (childScope) => createLogger(scope ? `${scope}:${childScope}` : childScope),
  };
};

export const logger = createLogger();

export const createScopedLogger = (scope: string): Logger => createLogger(scope);
