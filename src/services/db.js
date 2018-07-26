const mysql = require('mysql');

const connection  = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const query = function (queryString, parameters) {
    return new Promise((resolve, reject) => {
        const resultCb = (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        };

        connection.query(queryString, parameters, resultCb);
    });
};

module.exports = {
    query,
};

