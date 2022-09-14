const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const quotesRouter = require('./routes/quotes');

const db = require('./services/db');

db.initDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/quotes', quotesRouter);

// Listen on the environment set port or default 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;