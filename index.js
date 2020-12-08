const express = require('express');
const session = require('./middlewares/session.middleware');

const app = express();
const port = process.env.PORT;

// middlewares
app.use(session);
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/post', require('./routes/post'));
app.use('/api/user', require('./routes/user'));

app.listen(port, () => console.log(`Server is running on port ${port}...`));
