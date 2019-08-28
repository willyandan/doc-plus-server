const router = require('express').Router()
const userController = require('../src/controller/userController')
const verifyToken = require('../src/middleware/verifyToken')

/* POST cadastra um novo usuário */
router.post('/',userController.createMe)

/* POST realiza o login do usuário */
router.post('/oauth',userController.authorize)


router.use(verifyToken)

/* GET retorna usuário do jwt */
router.get('/',userController.getMe)

/* POST atualiza usuário do jwt */
router.put('/',userController.updateMe)

/* DELETE deleta um usuário*/
router.delete('/',userController.deleteMe)

module.exports = router