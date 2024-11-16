import winston from 'winston';

const { createLogger, transports, addColors, format } = winston;
const { combine, timestamp, colorize, printf} = format;

addColors({
	  error: 'red',
	  warn: 'yellow',
	  info: 'green',
	  http: 'magenta',
	  debug: 'blue'
});

const logFormat = printf(
	  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const logger = createLogger({
	transports: [
		new transports.File({ filename: "log/error.log", level: "error" }),
		new transports.File({ filename: "log/combined.log" }),
		new transports.Console({
			format: combine(logFormat, colorize({ all: true })),
		}),
	],
	format: combine(
		timestamp({
			format: "DD-MM-YYYY HH:mm:ss",
		}),
		logFormat,
		colorize({ all: true})
	),
});

export default logger;