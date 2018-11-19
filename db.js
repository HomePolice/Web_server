const mysql = require('mysql');

// 트랜젝션 처리를 위해 mysql databse pool 사용
const pool = mysql.createConnection({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

exports.pool = pool;