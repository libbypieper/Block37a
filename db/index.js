const pg = require('pg');
const { Client } = pg
const client = new Client({
    user: 'libbypieper',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'review_site',
})

module.exports = {
   client
};
