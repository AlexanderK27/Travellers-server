const session = require('express-session');
const connectRedis = require('connect-redis');
const redisClient = require('../db/redis');

const RedisStore = connectRedis(session);

module.exports = session({
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 1000 * 60 * 30
	},
	name: 'sessionId',
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET,
	store: new RedisStore({ client: redisClient })
});
