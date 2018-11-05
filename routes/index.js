const express = require('express');
const router = express.Router();
const databaseService = require('../database-service');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
