const express = require('express');
const router = express.Router();
const databaseService = require('../database-service');
const neo4jService = require('../neo4j-service');
let DTO = require('../dto');

router.get('/', (req, res) => {
    res.send("data");
})

router.post('/rank', (req, res) => {
    databaseService.getRank(req.body.account)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

router.post('/geo', (req, res) => {
    databaseService.getGeoInfo(req.body.account)
        .then((result) => {
            // Neo4j에 조회해야함.

            res.json(result)
        })
        .catch((error) => res.json(new DTO(false, error.message)));
})

router.post('/test', async (req, res) => {
    let result = await neo4jService.getCountByIP(req.body.ip);
    console.log(result);
    res.send(result);
})

module.exports = router;
