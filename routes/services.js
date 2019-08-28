const express = require('express');
const router = express.Router();
const serviceContrller = require('../src/controller/serviceController')
const verifyRole = require('../src/middleware/verifyRole')
const verifyToken = require('../src/middleware/verifyToken')
router.use(verifyToken)
/* GET list all services. */
router.get('/',verifyRole('service:list'),serviceContrller.list)

/* POST create one service */
router.post('/',verifyRole('service:create'),serviceContrller.create)

/*POST update a service */
router.put('/:id',verifyRole('service:update'),serviceContrller.update)

/* GET get a service */
router.get('/:id',verifyRole('service:read'),serviceContrller.read)

/* DELETE delete a service */
router.delete('/:id',verifyRole('service:delete'),serviceContrller.delete)
module.exports = router;
