const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const crypto = require('crypto-promise');

//회원가입 라우터
router.post('/', async (req, res, next) => {

    let userMail = req.body.email;
    let userPw = req.body.password;

    console.log(userMail);

    //salt 값 추가
    const salt = await crypto.randomBytes(32);
    const hashedpw = await crypto.pbkdf2(userPw, salt.toString('base64'), 100000, 32, 'sha512');

    //DB에 유저 정보 저장 쿼리
    let insertQuery =
        `
        INSERT INTO user (user_mail, user_pw, salt) 
        VALUES (?, ?, ?)
        `;

    let insertResult = await db.queryParamArr(insertQuery, [userMail, hashedpw.toString('base64'), salt.toString('base64')]);

    if(!insertResult){ // 쿼리수행중 에러가 있을 경우
        res.status(500).send({
            message : "Internal Server Error"
        });
    } else {
        res.status(200).send({
            message: "Success To Sign Up"
        })
    }
});


module.exports = router;
