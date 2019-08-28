const router = require('express').Router()
const userController = require('../src/controller/userController')
const verifyRole = require('../src/middleware/verifyRole')
const verifyToken = require('../src/middleware/verifyToken')

router.use(verifyToken)
/* GET lista todas as usuário */
router.get('/',verifyRole('user:list'),userController.list)

/* POST cadastra uma nova usuário */
router.post('/',verifyRole('user:create'),userController.create)

/* GET pega um clinica pelo id fornecido */
router.get('/:id',verifyRole('user:read'),userController.read)

/* PUT atualiza uma usuário*/
router.put('/:id',verifyRole('user:update'),userController.update)

/* DELETE deleta um usuário*/
router.delete('/:id',verifyRole('user:delete'),userController.delete)

module.exports = router