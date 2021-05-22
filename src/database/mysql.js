const mysql = require('mysql');

const connection = mysql.createPool({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : 'DUP',
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

module.exports = { query };