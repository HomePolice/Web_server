const express = require('express');
const router = express.Router();

const signinRouter = require('./user/signin');
const signupRouter = require('./user/signup');
const vizRouter = require('./viz/index');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use('/viz', vizRouter);


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;