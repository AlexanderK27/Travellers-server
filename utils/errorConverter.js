module.exports = error => {
	if (!error.status || error.message === 'Unkown error') {
		return { status: 500, message: 'Something went wrong. Please try again later.' };
	} else {
		return { status: error.status, message: error.message };
	}
};
