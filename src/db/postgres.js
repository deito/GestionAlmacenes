const config = require('../config');
const { Pool } = require('pg');

const types = require('pg').types;

types.setTypeParser(1114, function(stringValue) {

  var temp = new Date(stringValue);
  return new Date(Date.UTC(
      temp.getFullYear(), temp.getMonth(), temp.getDate(),temp.getHours(), temp.getMinutes(), temp.getSeconds(), temp.getMilliseconds())
  );
});


const pool = new Pool({
    user: config.postgres.user,
    password: config.postgres.password,
    host: config.postgres.host,
    port: config.postgres.port,
    database: config.postgres.database,    
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
  });

module.exports = {
    async query(text, params) {
      const start = Date.now()
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      return res
    },
    async getClient() {
      const client = await pool.connect()
      const query = client.query
      const release = client.release
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000)
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
      }
      client.release = () => {
        // clear our timeout
        clearTimeout(timeout)
        // set the methods back to their old un-monkey-patched version
        client.query = query
        client.release = release
        return release.apply(client)
      }
      return client
    }
  };