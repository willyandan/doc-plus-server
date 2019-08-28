const express = require('express')
const CustomError = require('../controller/CustomError')
const debug = require('debug')('server:user')
const jwt = require('jsonwebtoken')


function validateToken(token){
  return jwt.verify(token, process.env.JWT_PASSWORD)
}

/**
 * @param {express.request} req
 * @param {express.response} res
 * @param {function} next
 */
module.exports = async(req, res, next) =>{
  try {
    if(!req.headers.authorization){
      throw new CustomError(401,'InvalidTokenMethod','Token não encontrado')
    }
    const [method, token] = req.headers.authorization.split(' ')
    if(method != 'Bearer'){
      throw new CustomError(401,'InvalidTokenMethod','Método do token não encontrado')
    }
    validateToken(token)
    req.token = token
    next()
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.message
      }).end()
    }
    else if(error instanceof jwt.TokenExpiredError){
      res.status(401).json({
        code:401,
        name:'TokenExpiredError',
        message:'Token expirado'
      }).end()
    }
    else if(error instanceof jwt.NotBeforeError){
      res.status(401).json({
        code:401,
        name:'NotBeforeError',
        message:'Token ainda não é valido'
      }).end()
    }else if(error instanceof jwt.JsonWebTokenError){
      res.status(401).json({
        code:401,
        name:'JsonWebTokenError',
        message:'Erro ao validar token'
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