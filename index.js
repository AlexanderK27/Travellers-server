const express = require('express');
const session = require('./middlewares/session.middleware');

const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(session);

// routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/comment', require('./routes/comment.route'));
app.use('/api/image', require('./routes/image.route'));
app.use('/api/post', require('./routes/post.route'));
app.use('/api/user', require('./routes/user.route'));

app.listen(port, () => console.log(`Server is running on port ${port}...`));
