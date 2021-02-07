export enum LoggerLevel {
	NONE,
	INFO,
	WARN,
	DEBUG
}

export interface ILogger {
	level: LoggerLevel,
	outputCommand: (...args: unknown[]) => void;
}

export class Logger implements ILogger {
	level: LoggerLevel;
	outputCommand: (...args: unknown[]) => void;

	constructor(level: LoggerLevel, outputCommand?: (...args: unknown[]) => void) {
		this.level = level;
		if (outputCommand !== undefined) {
			this.outputCommand = outputCommand
		} else {
			this.outputCommand = console.log
		}
	}

	log(level: LoggerLevel, ...args: unknown[]) {
		if (this.level === LoggerLevel.NONE) { 
			return;
		} else if (this.level >= level) {
			this.outputCommand(...args)
		}
	}

	info(...args: unknown[]) {
		this.log(LoggerLevel.INFO, ...args)
	}
	warn(...args: unknown[]) {
		this.log(LoggerLevel.WARN, ...args)
	}
	debug(...args: unknown[]) {
		this.log(LoggerLevel.DEBUG, ...args)
	}
}

export let DefaultLogger = new Logger(LoggerLevel.NONE)

export default DefaultLogger
