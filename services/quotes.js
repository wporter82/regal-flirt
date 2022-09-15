if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const config = require('../config');
const supabase = require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

async function getPage(page = 1) {
    const offset = (page - 1) * config.quotesPerPage;
    const {data,error} = await supabase.from('quotes').select().range(offset, config.quotesPerPage);
    if (error) {
        throw error;
    }
    return data;
}

async function getRandom(count = 1) {
    if (count > config.maxRandCount) {
        count = config.maxRandCount;
    }
    const {data,error} = await supabase.from('random_quotes').select().limit(count);
    if (error) {
        throw error;
    }
    return data;
}

async function create(quote) {
    if (!quote.quote_text) {
        let error = new Error("Quote is empty!");
        error.statusCode = 400;
        throw error;
    }

    if (quote.quote_date == '') {
        delete quote.quote_date;
    }

    const {data,error} = await supabase.from('quotes')
        .insert([quote]);

    if (error) {
        let message = '';
        if (error.code == '23505') {
            message = "Quote already exists!";
        } else {
            message = error.message;
        }
        let err = new Error(message);
        err.statusCode = 400;
        throw err;
    }

    return { message: 'Quote added successfully' };
}

module.exports = {
    getPage,
    getRandom,
    create
}