const config = {};
config.postgres = {
    user: 'postgres',
    password: '',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'GestionAlmacen'

}

config.express = {
    port: process.env.EXPRESS_PORT || 4000,
    ip: '127.0.0.1'
}

module.exports = config;