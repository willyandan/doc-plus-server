const router = require('express').Router()
const clinicController = require('../src/controller/clinicController')
const verifyRole = require('../src/middleware/verifyRole')
const verifyToken = require('../src/middleware/verifyToken')

/** GET  */
router.use(verifyToken)

/* GET lista todas as clinicas */
router.get('/',verifyRole('clinic:list'),clinicController.list)

/* GET lista todas as clinicas por ordem da menor distancia para a coordenada fornecida e paginadas*/
router.get('/search',verifyRole('clinic:search'),clinicController.search)

/* POST cadastra uma nova clinica */
router.post('/',verifyRole('clinic:create'),clinicController.create)

/* GET pega um clinica pelo id fornecido */
router.get('/:id',verifyRole('clinic:read'),clinicController.read)

/* PUT atualiza uma clinica*/
router.put('/:id',verifyRole('clinic:update'),clinicController.update)

/* DELETE deleta um clinica*/
router.delete('/:id',verifyRole('clinic:delete'),clinicController.delete)

module.exports = router