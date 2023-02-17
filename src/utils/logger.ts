import debug from "debug";

const APP_NAME = "sipcaller";

export default class Logger {
	_debug: debug.Debugger;
	_warn: debug.Debugger;
	_error: debug.Debugger;
	constructor(prefix: string) {
		this._debug = prefix ? debug(`${APP_NAME}:${prefix}`) : debug(APP_NAME);
		this._warn = prefix
			? debug(`${APP_NAME}:WARN:${prefix}`)
			: debug(`${APP_NAME}:WARN`);
		this._error = prefix
			? debug(`${APP_NAME}:ERROR:${prefix}`)
			: debug(`${APP_NAME}:ERROR`);

		/* eslint-disable no-console */
		this._debug.log = console.info.bind(console);
		this._warn.log = console.warn.bind(console);
		this._error.log = console.error.bind(console);
		/* eslint-enable no-console */
	}
}
