const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../db/flirts.db');

console.log(`[db] Opening database file: ${dbFile}`);
var db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        throw err;
    }
});

/**
 * Check for existance of DB and create or fix it if necessary
 */
function initDB() {
    console.log('[db] Checking table structure...');
    db.run(
        'SELECT quote_id, quote_text, quote_date, show_name \
        FROM quotes \
        LIMIT 1',
        (err) => {
            if (err) {
                console.log("[db] DB table structure is incorrect. Attempting to recreate...")
                createTable();
            }
        }
    );
}

function createTable() {
    console.log("[db] Creating/recreating DB table...");
    
    db.run('DROP TABLE IF EXISTS quotes;',(err) => {
        if (err) {
            throw err;
        }
    });

    db.run(
        'CREATE TABLE quotes (\
            quote_id INTEGER PRIMARY KEY,\
            quote_text TEXT NOT NULL UNIQUE,\
            quote_date DATE,\
            show_name TEXT\
        );',
        (err) => {
            if (err) {
                throw err;
            }
            console.log("[db] DB table created");
            populateTableData();
        }
    );
}

function populateTableData(db) {
    console.log("[db] Populating DB with data from json file...");
    const flirts = require('./flirts.json');
    let sql = 'INSERT INTO quotes(quote_text,quote_date,show_name) VALUES (?, ?, ?)';

    flirts.quotes.forEach((flirt) => {
        let params = [flirt.quote, flirt.date, flirt.show];
        
        db.run(sql, params, (err) => {
            if (err) {
                throw err;
            }
        });
    });
    console.log("[db] Finished populating DB");
}

function query(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });

    });
}

function insert(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

module.exports = {
    initDB,
    query,
    insert
};