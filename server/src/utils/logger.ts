import { createLogger, format, transports } from 'winston'
// import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,SSS' }),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  defaultMeta: {
    service: 'eazzyBizz'
  },
  transports: [
    new transports.File({ filename: 'logs/app.log' })
  ],
});

// const dailyRotateFileTransport = new DailyRotateFile({
//   filename: path.join(pathToLog, '%DATE%-combined.log'),
//   datePattern: 'YYYY-MM-DD',
//   zippedArchive: true,
//   maxSize: '20m',
//   maxFiles: '14d'
// });

// logger.add(dailyRotateFileTransport);

export default logger