const express = require('express');
const router = express.Router();
const databaseService = require('../database-service');

router.post('/validation', (req, res) => {
    databaseService.isValidCredentials(req.body.email, req.body.password)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

router.get('/test', function (req, res) {
    databaseService.getAllUsers()
      .then((result) => res.json(result))
      .catch((error) => res.json(error))
})


module.exports = router;
