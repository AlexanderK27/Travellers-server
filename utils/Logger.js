const chalk = require('chalk');

const theme = {
	error: chalk.bold.red
};

class Logger {
	constructor(theme) {
		this.error = theme.error;
	}

	logError = (where, error) => {
		console.error(this.error('Error in: [' + where + ']'), error);
	};
}

module.exports = new Logger(theme);
