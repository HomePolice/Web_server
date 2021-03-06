const express = require('express');
const router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');

// 유저 관련 라우터

router.get('/', (req, res) => {
    res.send("user");
})

// Join
router.post('/', function (req, res) {
    databaseService.createUser(req.body.account, req.body.password)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

// Login
router.post('/validation', (req, res) => {
    databaseService.isValidCredentials(req.body.account, req.body.password)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

module.exports = router;
