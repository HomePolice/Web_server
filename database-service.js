const db = require('./db');
let DTO = require('./dto');
let dateTime = require('node-datetime');

// Mysql 통신 서비스

/*
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
*/

// 회원가입 중복체크
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

// 회원가입 시 데이터베이스에 새로운 유저 기록
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

// 실제 등록하는 부분
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

// 로그인
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

// 보안 등급을 조회
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

// geochart에 들어갈 나라별 트래픽 조회
exports.getGeoCount = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT sum(count) AS abnormal_count, nation FROM homepolice.history WHERE account = '${account}' GROUP BY nation;`;
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

// 나라별 히스토리 조회
exports.getNationHistory = function (account, nation) {
    return new Promise((resolve, reject) => {
        let query = `SELECT src_ip, dest_ip, protocol, occured_time FROM homepolice.history WHERE account = '${account}' AND nation = '${nation}';`;
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

// line chart 상한, 하한선 조회
exports.getThreshold = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT min, origin , max FROM homepolice.thresholds WHERE account = '${account}';`;
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

// 메인 화면 리스트 조회
exports.getAllHistory = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM homepolice.history WHERE handled = 0 AND account = '${account}' ORDER BY occured_time DESC LIMIT 5;`;
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


// 가장 최근에 발견된 위협 조회
exports.getLatestIp = function (account) {
    return new Promise((resolve, reject) => {
        let query = `SELECT dest_ip, nation FROM (SELECT count(*) AS cnt, dest_ip, nation, account FROM homepolice.history GROUP BY dest_ip ORDER BY occured_time DESC) AS a WHERE a.account = '${account}' AND a.cnt = 1 LIMIT 1`;
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

// 예외 리스트 등록
exports.registerExcept = function (account, ip) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO homepolice.excepts (ip, account) VALUES (\'" + ip + "\',\'" + account + "\')";
        db.pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}