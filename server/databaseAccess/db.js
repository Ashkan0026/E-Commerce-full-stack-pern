const pg = require('pg')

const databaseOptions = {
    user : "postgres",
    host : "localhost",
    database : "postgres",
    password : "@shk1382",
    port : 5432
}

const pool = new pg.Pool(databaseOptions)

module.exports = pool