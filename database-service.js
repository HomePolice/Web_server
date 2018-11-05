const db = require('./db');
let DTO = require('./dto');


exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user';
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}