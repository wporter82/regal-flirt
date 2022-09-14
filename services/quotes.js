const config = require('../config');
const db = require('./db');

async function getPage(page = 1) {
    const offset = (page - 1) * config.quotesPerPage;
    return await db.query(
        'SELECT quote_id, quote_text, quote_date, show_name \
        FROM quotes LIMIT ? OFFSET ?',
        [config.quotesPerPage, offset]
    );
}

async function getRandom(count = 1) {
    if (count > config.maxRandCount) {
        count = config.maxRandCount;
    }
    return await db.query(
        'SELECT quote_id, quote_text, quote_date, show_name \
        FROM quotes ORDER BY random() LIMIT ?',
        [count]
    );
}

async function create(quote) {
    if (!quote.quote_text) {
        let error = new Error("Quote is empty!");
        error.statusCode = 400;
        throw error;
    }
    
    let message = 'Error adding quote';
    
    try {
        const result = await db.insert(
            'INSERT INTO quotes(quote_text, quote_date, show_name) \
            VALUES (?, ?, ?)',
            [quote.quote_text, quote.quote_date, quote.show_name]
        );

        if (result) {
            message = 'Quote added successfully';
        }
    } catch (err) {
        if(err.code == "SQLITE_CONSTRAINT") {
            let error = new Error("Quote already exists!");
            error.statusCode = 400;
            throw error;
        } else {
            throw err;
        }
    }

    return {message};
}

module.exports = {
    getPage,
    getRandom,
    create
}