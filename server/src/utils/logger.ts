import { createLogger, format, transports } from 'winston'
// import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      const datetime = new Date(timestamp as string)
      const formatted = datetime.toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      }).replace(',', '')
      return `${formatted} ${level.toUpperCase()}: ${message}`
    })
  ),
  // format: format.combine(
  //   format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  //   format.errors({ stack: true }),
  //   format.splat(),
  //   format.json()
  // ),
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