const express = require('express');
const router = express.Router();
const databaseService = require('../database-service');
const neo4jService = require('../neo4j-service');
let DTO = require('../dto');

router.get('/', (req, res) => {
    res.send("data");
})

// Rank
router.post('/rank', (req, res) => {
    databaseService.getRank(req.body.account)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

// Geo Chart
router.post('/geo', (req, res) => {
    databaseService.getGeoCount(req.body.account)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

// Geo chart detail info
router.post('/getHistory', (req, res) => {
    databaseService.getNationHistory(req.body.account, req.body.nation)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

// Line Chart
router.post('/getThreshold', (req, res) => {
    databaseService.getThreshold(req.body.account)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

// Box Plot Init
router.post('/getMost5', async (req, res) => {
    let result = await neo4jService.getCountByIP(req.body.account, req.body.ip);
    console.log(result);
    res.send(result);
})

// Box Plot Data
router.post('/getCountByIp', async (req, res) => {
    let result = await neo4jService.getCountByIP(req.body.account, req.body.ip);
    console.log(result);
    res.send(result);
})

// Net Chart
router.post('/get2HopNet', async (req, res) => {
    let result = await neo4jService.get2HopNet(req.body.account);
    console.log(result);
    res.send(result);
})

module.exports = router;
