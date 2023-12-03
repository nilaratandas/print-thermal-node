const winston = require('winston');
require('winston-daily-rotate-file');
const { format, transports } = winston;
const { combine, timestamp, printf, json } = format;
const fs = require('fs');

var _ = require('underscore');

class InternalLogger {
    constructor(logger) {
        this.logger = logger;
    }

    strArgs(args) {
        return args;
    }
    log(...args) {
        return this.logger.log.apply(this.logger, this.formatloggerInput(args));
    }

    info(...args) {
        return this.logger.info.apply(this.logger, this.formatloggerInput(args));
    }

    warn(...args) {
        return this.logger.warn.apply(this.logger, this.formatloggerInput(args));
    }

    error(...args) {
        return this.logger.error.apply(this.logger, this.formatloggerInput(args));
    }

    debug(...args) {
        return this.logger.debug.apply(this.logger, this.formatloggerInput(args));
    }

    silly(...args) {
        return this.logger.silly.apply(this.logger, this.formatloggerInput(args));
    }

    critical(...args) {
        return this.logger.critical.apply(this.logger, this.formatloggerInput(args));
    }
    verbose(...args) {
        return this.logger.verbose.apply(this.logger, this.formatloggerInput(args));
    }

    trace(...args) {
        return this.logger.trace.apply(this.logger, this.formatloggerInput(args));
    }

    // BPAD-1818
    formatloggerInput(input) {
        if (Array.isArray(input)) {
            let newArray = [];
            if (input.length > 1) {
                for (let value of input) {
                    if (typeof value === 'undefined') {
                        newArray.push('undefined');
                    } else {
                        if (typeof value === 'object') {
                            newArray.push(JSON.stringify(value));
                        } else {
                            newArray.push(value);
                        }
                    }
                }
                return [newArray.join(", ")];
            } else {
                return input;
            }
        } else {
            return input;
        }
    }
};


var winstonLogMode = "file";
if (!winstonLogMode)
    winstonLogMode = "console";

var config = {
    directory: "logs",
    logLevel: process.env.LOG_LEVEL || "info",
    systemLogFile: "system.log",
    auditLogFile: "audit.log",
    winstonLogMessagesMode: winstonLogMode,
    serviceName: ""
};

var logDir = "./" + config.directory;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const customFormat = printf(info => {
    var str = `[${info.timestamp}] [${info.level.toUpperCase()}]: [POS] ${info.message}`;
    if (info.meta) {
        str = str + JSON.stringify(info.meta);
    }
    if (info instanceof Error)
        str += " /--/ " + JSON.stringify(info.stack);

    return str;
});

var loggerFormat = combine(timestamp(), json(), customFormat);
var loggerTransports = [];
var auditLoggerTransports = [];


if (winstonLogMode && winstonLogMode.includes('console')) {
    loggerTransports.push(new transports.Console({
        timestamp: true,
        colorize: true
    }));
    auditLoggerTransports.push(new transports.Console({
        timestamp: true,
        colorize: true
    }));

}

if (winstonLogMode && winstonLogMode.includes('file')) {
    loggerTransports.push(new transports.File({
        name: 'system-log-file',
        filename: logDir + '/' + config.systemLogFile,
        timestamp: true,
        level: config.logLevel
    }));
}

var logLevels = {
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warn: 4,
    notice: 5,
    info: 6,
    debug: 7,
    trace: 8
};



var logger = new InternalLogger(winston.createLogger({
    level: config.logLevel,
    format: loggerFormat,
    defaultMeta: { service: config.serviceName },
    transports: loggerTransports,
    exitOnError: false,
    levels: logLevels
}));

var auditLogger = new InternalLogger(winston.createLogger({
    level: config.logLevel,
    format: loggerFormat,
    defaultMeta: { service: config.serviceName },
    transports: auditLoggerTransports,
    exitOnError: false,
    levels: logLevels
}));

function log() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.info(totalResult.join(','));
}

function info() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });

    logger.info(totalResult.join(','));
}

function error() {
    var totalResult = _.map(arguments, function (value) {
        if (value instanceof Error)
            logger.error(value);

        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.error(totalResult.join(','));
}

function warn() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.warn(totalResult.join(','));
}

function debug() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.debug(totalResult.join(','));
}

function trace() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.trace(totalResult.join(','));
}


function critical() {
    var totalResult = _.map(arguments, function (value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return _.extend(value, ',');
    });
    logger.critical(totalResult.join(','));
}


module.exports.logger = logger;
module.exports.log = log;
module.exports.info = info;
module.exports.error = error;
module.exports.warn = warn;
module.exports.debug = debug;
module.exports.trace = trace;
module.exports.critical = critical;
module.exports.logLevels = logLevels;
