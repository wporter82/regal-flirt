const express = require('express');
const router = express.Router();
const quotes = require('../services/quotes');

router.get('/', (req, res, next) => {
    try {
        res.json(quotes.getPage(req.query.page));
    } catch (err) {
        console.error(`Error while getting quotes `, err.message);
        res.status(err.statusCode || 500).json({'message': err.message});
    }
});

router.get('/random', (req, res, next) => {
    try {
        res.json(quotes.getRandom(req.query.count));
    } catch (err) {
        console.error(`Error while getting random quote `, err.message);
        res.status(err.statusCode || 500).json({'message': err.message});
    }
});

module.exports = router;