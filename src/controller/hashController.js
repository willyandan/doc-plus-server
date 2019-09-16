const bcrypt = require('bcrypt')
module.exports = {
    hashPassword: (password)=>{
        const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT))
        return bcrypt.hashSync(password,salt)                             
    }                                                                   
}
