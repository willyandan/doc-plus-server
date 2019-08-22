const router = require('express').Router()
const clinicController = require('../src/controller/clinicController')

/* GET lista todas as clinicas */
router.get('/',clinicController.list)

/* GET lista todas as clinicas por ordem da menor distancia para a coordenada fornecida e paginadas*/
router.get('/search',clinicController.search)

/* POST cadastra uma nova clinica */
router.post('/',clinicController.create)

/* GET pega um clinica pelo id fornecido */
router.get('/:id',clinicController.read)

/* PUT atualiza uma clinica*/
router.put('/:id',clinicController.update)

/* DELETE deleta um clinica*/
router.delete('/:id',clinicController.delete)

module.exports = router