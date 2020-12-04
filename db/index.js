const Pool = require('pg').Pool;

const devConfig = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGNAME}`;

const prodConfig = process.env.DATABASE_URL;

const pool = new Pool({
	connectionString: process.env.NODE_ENV === 'production' ? prodConfig : devConfig
});

module.exports = {
	async query(text, params) {
		const start = Date.now();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		console.log('executed query', { text, duration, rows: res.rowCount });
		return res;
	}
};
