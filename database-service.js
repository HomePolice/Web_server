const db = require('./db');
let DTO = require('./dto');
let dateTime = require('node-datetime');

exports.getAllAccounts = function () {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM accounts';
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

isExistingAccount = function (accountname) {
    return new Promise((resolve, reject) => {
        let query = `SELECT EXISTS(SELECT * FROM accounts WHERE account = '${accountname}');`;
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            let result = rows[0];
            resolve(result[Object.keys(result)[0]]);
        })
    })
}

exports.createUser = async function (account, password) {
    let accountAlreadyExists = await isExistingAccount(account);
    console.log(accountAlreadyExists);
    if (accountAlreadyExists) {
        return new DTO(false, "Email exists. Please choose a different email.");
    } else {
        let successfulSave = await saveUser(account, password);
        return new DTO(true);
    }
}

saveUser = function (account, password) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO accounts (account, password) VALUES (\'" + account + "\',\'" + password + "\')";
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

exports.isValidCredentials = function (account, password) {
    return new Promise((resolve, reject) => {
        let query = `SELECT EXISTS(SELECT * FROM accounts WHERE account = '${account}' AND password = '${password}');`;
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            let result = rows[0];
            isValid = Boolean(result[Object.keys(result)[0]]);
        })

        let dt = dateTime.create();
        let time = dt.format('Y-m-d H:M:S');
        query = `UPDATE accounts SET last_login = '${time}' WHERE account = '${account}';`;
        db.pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(new DTO(isValid));
        })
    })
}


// DATA

exports.getRank = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ranks WHERE account = '${account}';`;
        console.log(query);
        db.pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

// SELECT sum(count) AS abnormal_count, nation FROM homepolice.history WHERE device_id = (SELECT device_id FROM devices WHERE account = "test") GROUP BY nation;
exports.getGeoInfo = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT sum(count) AS abnormal_count, nation FROM homepolice.history WHERE device_id = (SELECT device_id FROM devices WHERE account = '${account}') GROUP BY nation;`;
        console.log(query);
        db.pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            console.log(rows);
            resolve(rows);
        })
    })
}