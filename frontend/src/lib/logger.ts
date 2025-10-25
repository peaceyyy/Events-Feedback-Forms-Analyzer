/**
 * Centralized logging utility that respects DEBUG_MODE environment variable.
 * 
 * Usage:
 *   import logger from '@/lib/logger';
 *   logger.debug('Component loaded', { data });
 *   logger.info('User action performed');
 *   logger.warn('Potential issue detected');
 *   logger.error('Error occurred', error);
 * 
 * In production (NEXT_PUBLIC_DEBUG_MODE !== 'true'), debug and info logs are suppressed.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
  }

  /**
   * Debug-level logging for detailed troubleshooting (suppressed in production)
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Info-level logging for general information (suppressed in production)
   */
  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Warning-level logging for potential issues (always shown)
   */
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  /**
   * Error-level logging for errors and exceptions (always shown)
   */
  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  /**
   * Group related logs together (respects debug mode for grouping)
   */
  group(label: string, callback: () => void): void {
    if (this.isDevelopment) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  }

  /**
   * Log a table (useful for arrays of objects, respects debug mode)
   */
  table(data: unknown): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }
}

// Export a singleton instance
const logger = new Logger();
export default logger;
