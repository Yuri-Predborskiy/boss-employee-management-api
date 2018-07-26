const mysql = require('mysql');

const pool  = mysql.createPool(process.env.DATABASE_URL);

const query = function (queryString, parameters) {
    return new Promise((resolve, reject) => {
        const resultCb = (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        };

        pool.query(queryString, parameters, resultCb);
    });
};

module.exports = {
    query,
};
