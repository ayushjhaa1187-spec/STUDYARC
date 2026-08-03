import winston from 'winston';

// Sensitive keys to redact
const sensitiveKeys = ['password', 'token', 'access_token', 'refresh_token', 'razorpay_payment_id', 'email', 'secret', 'authorization'];

const redactLog = winston.format((info) => {
  const deepRedact = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(deepRedact);
    
    const newObj: any = {};
    for (const key in obj) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        newObj[key] = '[REDACTED]';
      } else {
        newObj[key] = typeof obj[key] === 'object' ? deepRedact(obj[key]) : obj[key];
      }
    }
    return newObj;
  };

  if (info.message && typeof info.message === 'object') {
    info.message = deepRedact(info.message);
  }
  
  // Also redact metadata if any
  for (const key in info) {
    if (key !== 'level' && key !== 'message' && key !== 'timestamp' && typeof info[key] === 'object') {
      info[key] = deepRedact(info[key]);
    }
  }

  return info;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    redactLog(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} ${level}: ${typeof message === 'object' ? JSON.stringify(message) : message} ${metaStr}`;
        })
      )
    })
  ]
});
