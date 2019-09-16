const router = require('express').Router()
const agreementController = require('../src/controller/agreementController')
const verifyRole = require('../src/middleware/verifyRole')
const verifyToken = require('../src/middleware/verifyToken')

/* GET lista todas as usuário */
router.get('/all',agreementController.list)

/* POST cadastra uma nova usuário */
router.post('/',agreementController.create)

router.use(verifyToken)

/* GET pega um clinica pelo id fornecido */
router.get('/', verifyRole('agreement:read'), agreementController.read)

/* PUT atualiza uma usuário*/
router.put('/',verifyRole('agreement:update'),agreementController.update)

/* DELETE deleta um usuário*/
router.delete('/',verifyRole('agreement:delete'),agreementController.delete)

module.exports = router
