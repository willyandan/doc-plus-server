const express = require('express');
const router = express.Router();
const serviceContrller = require('../src/controller/serviceController')
/* GET list all services. */
router.get('/',serviceContrller.list)

/* POST create one service */
router.post('/',serviceContrller.create)

/*POST update a service */
router.put('/:id',serviceContrller.update)

/* GET get a service */
router.get('/:id',serviceContrller.read)

/* DELETE delete a service */
router.delete('/:id',serviceContrller.delete)
module.exports = router;
