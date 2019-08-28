const express = require('express')
const CustomError = require('../controller/CustomError')
const debug = require('debug')('server:user')
const Role = require('../model/Role')
const jwt = require('jsonwebtoken')

module.exports = (scope) => async (req, res, next)=>{
  try {
    const data = jwt.decode(req.token)
    const role = await Role.findOne({_id:data.data.role},{scopes:1})
    for(s of role.scopes){
      if(s == scope){ return next()}
    }
    throw new CustomError(401,'PermissionDenied','Você não tem permissao para usar esse recurso')
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }
    else{
      res.status(500).json({
        code:500,
        name:'InternalError',
        message:'Erro interno'
      }).end()
    }
  }
}
 