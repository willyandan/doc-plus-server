const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const serviceRouter = require('./services');
const clinicRouter = require('./clinic')
/* GET version page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    version:process.env.VERSION
  }).end()
});
router.use('/users', usersRouter);
router.use('/service', serviceRouter);
router.use('/clinic',clinicRouter);
module.exports = router;
