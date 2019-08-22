const express = require('express')
const Services = require('../model/Services')
const CustomError = require('../controller/CustomError')

async function validateService(query){
  if(!query.service){
    throw new CustomError(400,'InvalidRequest','o nome do serviço não foi encontrado')
  }
}

function getServiceQuery(param){
  const query = {}
  if(param.service){
    query.service = RegExp(param.service,'i')
  }
  return query
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.list = async function(req, res){
  try{
    const query = getServiceQuery(req.query)
    const services = await Services.find(query).lean()
    res.status(200).json(services).end()
  }catch(error){
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.create = async function(req, res){
  try {
    await validateService(req.body)
    const hasService = await Services.exists({
      service:RegExp(req.body.service,'i')
    })
    if(hasService){
      throw new CustomError(403,'DuplicatedService','Esse serviço já existe')
    }
    const service  = new Services({
      service:req.body.service
    })
    await service.save()
    res.status(200).json(service).end()
  } catch (error) {
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.update = async function(req, res){
  try{
    await validateService(req.body)
    const hasService = await Services.exists({
      _id:{$ne:req.params.id},
      service:RegExp(req.body.service,'i')
    })
    if(hasService){
      throw new CustomError(403,'DuplicatedService','Esse serviço já existe')
    }
    await Services.updateOne({_id:req.params.id},req.body)
    let service = await Services.findOne({_id:req.params.id})
    if(!service){
      throw new CustomError(404,'ServiceNotFound','Serviço não encontrado')
    }

    res.status(200).json(service).end()
  }catch(error){
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.read = async function(req, res){
  try{
    const services = await Services.findOne({_id:req.params.id}).lean()
    if(!services){
      throw new CustomError(404,'ServiceNotFound','Serviço não encontrado')
    }
    res.status(200).json(services).end()
  }catch(error){
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.delete = async function(req, res){
  try{
    await Services.findOneAndDelete({_id:req.params.id})
    res.status(200).json("Serviço deletado com sucess").end()
  }catch(error){
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}