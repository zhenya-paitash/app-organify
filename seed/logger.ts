/**
 * Colorful logger for seed scripts
 */

export enum LogLevel {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  INPUT = 'input'
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

/**
 * Logger class for colorful console output
 */
export class Logger {
/**
   * Log message with timestamp and color formatting
   * @param message Message to log
   * @param level Log level (SUCCESS, ERROR, INFO, INPUT)
 */
  log(message: string, level: LogLevel = LogLevel.INFO): void {
    const date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let color = colors.gray;
    let prefix = 'INFO';

    switch (level) {
      case LogLevel.SUCCESS:
        color = colors.green;
        prefix = 'SUCCESS';
        break;
      case LogLevel.ERROR:
        color = colors.red;
        prefix = 'ERROR';
        break;
      case LogLevel.INPUT:
        color = colors.blue;
        prefix = 'INPUT';
        break;
      case LogLevel.INFO:
      default:
        color = colors.gray;
        prefix = 'INFO';
        break;
    }

    console.log(`${date} ${color}[${prefix}]${colors.reset}: ${message}`);
}

/**
   * Log info message (gray color)
   * @param message Message to log
   */
  info(message: string): void {
    this.log(message, LogLevel.INFO);
}

/**
   * Log success message (green color)
   * @param message Message to log
   */
  success(message: string): void {
    this.log(message, LogLevel.SUCCESS);
}

/**
   * Log error message (red color)
   * @param message Message to log
   */
  error(message: string): void {
    this.log(message, LogLevel.ERROR);
}

/**
   * Log input message (blue color)
   * @param message Message to log
   */
  input(message: string): void {
    this.log(message, LogLevel.INPUT);
}
}

// Create a singleton instance
const logger = new Logger();

// Export the instance as default export
export default logger;

// For backwards compatibility, export the log method
export const log = logger.log.bind(logger); 