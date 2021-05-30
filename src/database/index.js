const mysql = require('mysql');
const config = require('config').util.toObject();
const connection = mysql.createConnection({
  host     : config.databases.mysql.host,
  user     : config.databases.mysql.user,
  password : config.databases.mysql.password,
  database : config.databases.mysql.database,
});

const query = (sql, func) => {
  return new Promise((resolve, reject) => {

    connection.query(sql, func, function(error, results, fields) {
        if (error) {
          console.error(error.sqlMessage);
          return reject(new Error(error));
        }
        resolve(results);
    });
  });
}

const rowQuery = (sql, func) => {
  return new Promise((resolve, reject) => {

    connection.query(sql, func, function(error, results, fields) {
        if (error) {
          console.error(error.sqlMessage);
          return reject(new Error(error));
        }
        resolve(Object.values(JSON.parse(JSON.stringify(results))));
    });
  });
}

const showRows = (rows) => {
  if (rows) {
    return Object.values(JSON.parse(JSON.stringify(rows)))
  } else {
    throw new Error('No rows found')
  }
}

const ping = async () => {
  return connection.state ? 'OK' : 'ONGELMIA'
}

module.exports = { query, showRows, ping, rowQuery };