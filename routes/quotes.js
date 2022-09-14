const express = require('express');
const router = express.Router();
const quotes = require('../services/quotes');

router.get('/', async function(req, res, next) {
    try {
        res.json(await quotes.getPage(req.query.page));
    } catch (err) {
        console.error(`Error while getting quotes `, err.message);
        res.status(err.statusCode || 500).json({'message': err.message});
    }
});

router.get('/random', async function(req, res, next) {
    try {
        res.json(await quotes.getRandom(req.query.count));
    } catch (err) {
        console.error(`Error while getting random quote `, err.message);
        res.status(err.statusCode || 500).json({'message': err.message});
    }
});

router.post('/', async function(req, res, next) {
    try {
        res.json(await quotes.create(req.body));
    } catch (err) {
        console.error(`Error while adding quote `, err.message);
        res.status(err.statusCode || 500).json({'message': err.message});
    }
});

module.exports = router;