const config = require('../config');
const flirts = require('./flirts.json');

function getPage(page = 1) {
    const offset = (page - 1) * config.quotesPerPage;
    return flirts.quotes.slice(offset, offset + config.quotesPerPage);
}

function getRandom(count = 1) {
    if (count > config.maxRandCount) {
        count = config.maxRandCount;
    }
    const shuffled = [...flirts.quotes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

module.exports = {
    getPage,
    getRandom
}