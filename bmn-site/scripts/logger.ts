import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'scraper.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatMessage(level: string, message: string, ...args: any[]): string {
  const timestamp = new Date().toISOString();
  // Handle args if they are objects/errors
  const formattedArgs = args.map(arg => 
    arg instanceof Error ? arg.stack : 
    typeof arg === 'object' ? JSON.stringify(arg) : 
    arg
  ).join(' ');
  
  return `[${timestamp}] [${level}] ${message} ${formattedArgs}`;
}

function writeLog(text: string) {
  // Append to file synchronously for robustness during crashes
  try {
    fs.appendFileSync(LOG_FILE, text + '\n');
  } catch (err) {
    console.error('❌ Failed to write to log file:', err);
  }
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    const text = formatMessage('INFO', message, ...args);
    console.log(message, ...args); // Print to console
    writeLog(text);
  },
  
  warn: (message: string, ...args: any[]) => {
    const text = formatMessage('WARN', message, ...args);
    console.warn(message, ...args); // Print to console
    writeLog(text);
  },
  
  error: (message: string, ...args: any[]) => {
    const text = formatMessage('ERROR', message, ...args);
    console.error(message, ...args); // Print to console
    writeLog(text);
  }
};
