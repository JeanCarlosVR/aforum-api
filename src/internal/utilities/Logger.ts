//@ts-nocheck
import colors = require("colors");
import log = require('fancy-log');

colors.setTheme({
    silly: 'rainbow',
    log: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'cyan',
    error: 'red'
});

export default class Logger {
    public log(source: any, msg: any) {
        let message = colors.log(msg)
        log(`${source} | ${message}`);
    }

    public info(source: any, msg: any) {
        let message = colors.verbose(msg)
        log(`${source} | ${message}`);
    }

    public warn(source: any, msg: any) {
        let message = colors.warn(msg)
        log(`${source} | ${message}`);
    }

    public error(source: any, msg: any) {
        let message = colors.error(msg)
        log(`${source} | ${message}`);
    }

    public data(source: any, msg: any) {
        let message = colors.data(msg)
        log(`${source} | ${message}`);
    }

    public debug(source: any, msg: any) {
        let message = colors.debug(msg)
        log(`${source} | ${message}`);
    }

    public load(source: any, msg: any) {
        let message = colors.info(msg)
        log(`${source} | ${message}`);
    }
}