const Agreement = require('../model/Agreement')
const CustomError = require('./CustomError')
const hashController = require('./hashController')

/**
 * validateAgreement
 * valida todos os parametros do agreement e verifica se todos estao corretos e existem no documento
 * @param {any} document
 * 
 */
async function validateAgreement(doc){
    if(!doc.name){
        throw new CustomError(400,'InvalidRequest','O convenio precisa de um nome!') 
    }
    if(doc.users.length == 0){
        throw new CustomError(400, 'InvalidRequest', 'O convenio precisa de pelo menos um usuário')
    }
    for(let u of doc.users){
        if(!u.user || !u.password){
            throw new CustomError(400, 'InvalidRequest', 'Todo usuário do convenio precisa ter login e senha')
        }
    }
}
/**
 * parseAgreement
 * cria o documento agreement com base no body
 * nao é responsável por validar
 * TODO: Colocar as possíveis permissões desse usuário
 * @param {Object} body
 */
function parseAgreement(body){
    const doc = {}
    doc.name = body.name
    doc.users = []
    if(body.user && body.password){
        doc.users.push(
            {
                user:body.user,
                password:hashController.hashPassword(body.password)
            }
        )
    }
    doc.clinics = body.clinics || []
    return doc
}

/**
 * create
 * @param {express.request} req
 * @param {express.response} res
 * @param {Function}  nexr 
 */
async function create(req, res, next){
    try{
        const agreementDocument = parseAgreement(req.body)
        await validateAgreement(agreementDocument)
        const agreement = new Agreement(agreementDocument)
        await agreement.save()
        res.status(200).json(agreement).end()
    } catch(error){
        if(error instanceof CustomError){
            res.status(error.code).json({
                code:error.code,
                name:error.name,
                message:error.message
            }).end()
        }else{
            console.log(error)
            res.status(500).json({
                code:500,
                name:'InternalError',
                message:'Erro interno'
            }).end()
        }  
    }    
}

/**
 * list
 * @param {express.request} req
 * @param {express.response} res
 * @param {Function} next
 */
async function list(req, res, next){
    try{
        const agreements = await Agreement.find({},{
            _id:true,
            name:true
        })
        res.status(200).json(agreements).end()
    }catch(error){
        if(error instanceof CustomError){
            res.status(error.code)
                .json({
                    code:error.code,
                    name:error.name,
                    message:error.message
                })
                .end()
        }else{
            res.status(500)
                .json({
                    code: 500,
                    name: 'InternalError',
                    message: 'Error interno'
                })
              .end()
        }
    }
}

/*
 * read
 * @param {express.request} req
 * @param {express.response} res
 * @param {Function} next
 */
async function read(req, res, next){
    try{
        const agreement = await Agreement.findOnee({_id:req.params.id})
        if(!agreement){
            throw new CustomError(404, 'AgreementNotFound', 'Convenio não encontrado')
        }
        res.status(200).json(agreement).end()
    }catch(error){
        if(error instanceof CustomError){   
            res.status(error.code)          
            .json({                     
                code:error.code,        
                name:error.name,        
                message:error.message   
            })                          
            .end()                      
        }else{                              
            res.status(500)                 
                .json({                     
                    code: 500,              
                name: 'InternalError',  
                message: 'Error interno'
            })                          
          .end()                        
        }                                   
    }
}

module.exports = {
    create,
    list,
    update:()=>{},
    delete:()=>{},
    read:()=>{}
}
