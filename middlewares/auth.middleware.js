module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		return next();
	}

	if (!req.session || !req.session.user) {
		return res.status(401).json({ error: 'Please sign in' });
	}

	next();
};
