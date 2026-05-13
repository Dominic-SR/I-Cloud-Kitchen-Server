import * as fs from 'fs';
import * as path from 'path';

// Define log directory
const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
const ensureLogsDir = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
};

// Get current date in YYYY-MM-DD format
const getDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Get current time in HH:mm:ss format
const getTimeString = () => {
  const now = new Date();
  return now.toISOString().split('T')[1].split('.')[0];
};

// Get full ISO timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Write to file
const writeToFile = (filename: string, message: string) => {
  ensureLogsDir();
  const filepath = path.join(LOGS_DIR, filename);
  const logEntry = `[${getTimestamp()}] ${message}\n`;

  try {
    fs.appendFileSync(filepath, logEntry, 'utf8');
  } catch (error) {
    console.error(`Failed to write to log file ${filename}:`, error);
  }
};

// Write JSON to file
const writeJSONToFile = (filename: string, label: string, data: any) => {
  ensureLogsDir();
  const filepath = path.join(LOGS_DIR, filename);
  const logEntry = `[${getTimestamp()}] ${label}\n${JSON.stringify(data, null, 2)}\n${'='.repeat(80)}\n`;

  try {
    fs.appendFileSync(filepath, logEntry, 'utf8');
  } catch (error) {
    console.error(`Failed to write to log file ${filename}:`, error);
  }
};

export const fileLogger = {
  // Write to general logs
  info: (message: string, data?: any) => {
    const dateStr = getDateString();
    const logMessage = `[INFO] ${message}`;
    console.log(`[${getTimestamp()}] ℹ️ ${message}`, data || '');
    writeToFile(`app-${dateStr}.log`, logMessage);
    if (data) {
      writeJSONToFile(`app-${dateStr}.log`, message, data);
    }
  },

  success: (message: string, data?: any) => {
    const dateStr = getDateString();
    const logMessage = `[SUCCESS] ${message}`;
    console.log(`[${getTimestamp()}] ✅ ${message}`, data || '');
    writeToFile(`app-${dateStr}.log`, logMessage);
    if (data) {
      writeJSONToFile(`app-${dateStr}.log`, message, data);
    }
  },

  warning: (message: string, data?: any) => {
    const dateStr = getDateString();
    const logMessage = `[WARNING] ${message}`;
    console.warn(`[${getTimestamp()}] ⚠️ ${message}`, data || '');
    writeToFile(`app-${dateStr}.log`, logMessage);
    if (data) {
      writeJSONToFile(`app-${dateStr}.log`, message, data);
    }
  },

  error: (message: string, error?: any) => {
    const dateStr = getDateString();
    const logMessage = `[ERROR] ${message}`;
    console.error(`[${getTimestamp()}] ❌ ${message}`, error || '');
    writeToFile(`error-${dateStr}.log`, logMessage);
    if (error) {
      writeJSONToFile(`error-${dateStr}.log`, message, error);
    }
  },

  debug: (message: string, data?: any) => {
    if (process.env.DEBUG === 'true') {
      const dateStr = getDateString();
      const logMessage = `[DEBUG] ${message}`;
      console.log(`[${getTimestamp()}] 🐛 ${message}`, data || '');
      writeToFile(`debug-${dateStr}.log`, logMessage);
      if (data) {
        writeJSONToFile(`debug-${dateStr}.log`, message, data);
      }
    }
  },

  // API-specific logging
  api: {
    request: (method: string, url: string, body?: any, params?: any, query?: any) => {
      const dateStr = getDateString();
      const logMessage = `[API REQUEST] ${method} ${url}`;
      console.log(`[${getTimestamp()}] ➡️ API REQUEST: ${method} ${url}`);
      if (body && Object.keys(body).length > 0) {
        console.log(`   📦 Body:`, body);
      }

      writeToFile(`api-${dateStr}.log`, logMessage);

      const requestData: any = {
        method,
        url,
        timestamp: getTimestamp(),
      };

      if (body && Object.keys(body).length > 0) requestData.body = body;
      if (params && Object.keys(params).length > 0) requestData.params = params;
      if (query && Object.keys(query).length > 0) requestData.query = query;

      writeJSONToFile(`api-${dateStr}.log`, `REQUEST: ${method} ${url}`, requestData);
    },

    response: (method: string, url: string, status: number, durationMs: string, body?: any) => {
      const dateStr = getDateString();
      const statusEmoji = status >= 400 ? '❌' : '✅';
      const logMessage = `[API RESPONSE] ${method} ${url} - Status: ${status} - Duration: ${durationMs}`;

      console.log(
        `[${getTimestamp()}] ${statusEmoji} API RESPONSE: ${method} ${url} - Status: ${status} - Duration: ${durationMs}`,
      );
      if (body && Object.keys(body).length > 0) {
        console.log(`   📤 Response:`, body);
      }

      writeToFile(`api-${dateStr}.log`, logMessage);

      const responseData: any = {
        method,
        url,
        status,
        durationMs,
        timestamp: getTimestamp(),
      };

      if (body && Object.keys(body).length > 0) responseData.body = body;

      writeJSONToFile(`api-${dateStr}.log`, `RESPONSE: ${method} ${url}`, responseData);
    },

    error: (method: string, url: string, statusCode: number, error: any, body?: any) => {
      const dateStr = getDateString();
      const logMessage = `[API ERROR] ${method} ${url} - Status: ${statusCode}`;

      console.error(`[${getTimestamp()}] ❌ API ERROR: ${method} ${url} - Status: ${statusCode}`, error);

      writeToFile(`api-error-${dateStr}.log`, logMessage);

      const errorData: any = {
        method,
        url,
        statusCode,
        timestamp: getTimestamp(),
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      };

      if (body) errorData.body = body;

      writeJSONToFile(`api-error-${dateStr}.log`, `ERROR: ${method} ${url}`, errorData);
    },
  },
};
