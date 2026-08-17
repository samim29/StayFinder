const express = require('express');

const authRouter = require('./routes/auth.route');
const pgRouter = require('./routes/pg.route');
const uploadRouter = require('./routes/upload.route');

const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

/**
 * 
 * @description health check route
 */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

/**
 * @description authentication routes
 */
app.use('/api/auth', authRouter);

/**
 * @description PG routes
 */

app.use('/api/pg', pgRouter);
app.use('/api/uploads', uploadRouter);


module.exports = app;
