const express = require('express');
const app = express();
const commentRoutes  = require('./routes/comments');
const itemRoutes = require('./routes/items');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.use(express.json());
app.use('/api', commentRoutes);
app.use('/api', itemRoutes);
app.use('/api', reviewRoutes);
app.use('/api', userRoutes);

module.exports = app;
