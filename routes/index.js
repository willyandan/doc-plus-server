const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const serviceRouter = require('./services');
const clinicRouter = require('./clinic')
const agreementRouter = require('./agreement');
const meRouter = require('./me')
/* GET version page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    version:process.env.VERSION
  }).end()
});
router.use('/user', usersRouter);
router.use('/service', serviceRouter);
router.use('/clinic',clinicRouter);
router.use('/me',meRouter);
router.use('/agreement',agreementRouter)
module.exports = router;
