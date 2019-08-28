const express = require('express')
const User = require('../model/User')
const Role = require('../model/Role')
const CustomError = require('./CustomError')
const oauthController = require('./oauthController')
const debug = require('debug')('server:user')
const bcrypt = require('bcrypt')

function isEmail(email){
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

function hashPassword(password){
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT))
  return bcrypt.hashSync(password,salt)
}

async function validateUser(doc, id=null){
  if(!id){
    if(!doc.email) throw new CustomError(400,'InvalidRequest','É preciso cadastrar um email')
    if(!doc.password) throw new CustomError(400,'InvalidRequest','É preciso cadastrar uma senha')
    if(!doc.name) throw new CustomError(400,'InvalidRequest','É preciso cadastrar um nome')
    if(!doc.birthDay) throw new CustomError(400,'InvalidRequest','É preciso cadastrar uma data de nascimento')
    // if(!doc.agreement) throw new CustomError(400,'InvalidRequest','É preciso escolher um convenio')
    if(!isEmail(doc.email)) throw new CustomError(400,'InvalidRequest','É preciso cadastrar um email válido')
    if(!doc.address) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar um endereço')
    if(!doc.address.state) throw new CustomError(400, 'InvalidRequest', 'É preciso escolher um estado')
    if(!doc.address.city) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar uma cidade')
    if(!doc.address.street) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar uma Rua/Av.')
    if(!doc.address.number) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar um numero')
    if(!doc.address.neighborhood) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar um bairro')
    if(!doc.address.zip) throw new CustomError(400, 'InvalidRequest', 'É preciso cadastrar um cep')
    
    const existsEmail = await User.exists({email:doc.email})
    if(existsEmail) throw new CustomError(400, 'DuplicateEmail', 'Esse email já está em uso por outro usuário')
  }else{
    if(doc.email && !isEmail(doc.email)) throw new CustomError(400,'InvalidRequest','É preciso cadastrar um email válido')
    const existsEmail = await User.exists({email:doc.email, _id:{$ne:id}})
    if(existsEmail) throw new CustomError(400, 'DuplicateEmail', 'Esse email já está em uso por outro usuário')
  }
  

}

function parseQuery(query){
  const params = {}
  if(query.name) params.name = RegExp(query.name,'ig')
  if(query.email) params.email = RegExp(query.email,'ig')
  if(query.birthDayMin) params.birthDay = {$gte:query.birthDayMin}
  if(query.birthDayMax){
    if(!params.birthDay){
      params.birthDay = {}
    }
    params.birthDay.$lte = new Date(query.birthDayMax)
  }
  if(query.state) params.state = RegExp(query.state,'ig')
  if(query.city) params.city = RegExp(query.city,'ig')
  if(query.street) params.street = RegExp(query.street,'ig')
  if(query.number) params.number = RegExp(query.number,'ig')
  if(query.zip) params.zip = RegExp(query.zip, 'ig')
  return params
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.list = async (req, res) =>{
  try {
    const query = parseQuery(req.query)
    const users = await User.find(query,{password:0}).lean()
    res.status(200).json(users).end()
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
module.exports.create = async (req, res) =>{
  try {
    await validateUser(req.body)
    const user = new User(req.body)
    user.password = hashPassword(user.password)
    user.role = (await Role.find({name:'user'}).lean())._id
    await user.save()
    res.status(200).json(user).end()
  } catch (error) {
    debug(error)
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
module.exports.read = async (req, res) =>{
  try {
    const user = await User.findOne({_id:req.params.id},{password:0}).lean()
    if(!user){
      throw new CustomError(404,'UserNotFound','Usuário não encontrado')
    }
    res.status(200).json(user).end()
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
module.exports.update = async (req, res) =>{
  try {
    await validateUser(req.body, req.params.id)
    if(req.body.password){
      req.body.password = hashPassword(req.body.password)
    }
    await User.findByIdAndUpdate({_id:req.params.id,},{...req.body})
    const user = await User.findOne({_id:req.params.id},{password:0}).lean()
    if(!user){
      throw new CustomError(404,'UserNotFound','Usuário não encontrado')
    }
    res.status(200).json(user).end()
  } catch (error) {
    debug(error)
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
module.exports.delete = async (req, res) =>{
  try {
    await User.deleteOne({_id:req.params.id})
    res.status(200).json("Usuário deletado com sucesso").end()
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
module.exports.authorize = async(req, res) =>{
  try {
    let user = await User.findOne({email:req.body.email}).lean()
    if(!user){
      throw new CustomError(401,'AuthorizationError','Email ou senha inválidos')
    }
    if(!oauthController.validateBcrypt(user.password, req.body.password)){
      throw new CustomError(401,'AuthorizationError','Email ou senha inválidos')
    }
    delete user.password
    const token = oauthController.generateToken(user)
    res.status(200).json(token).end()
  } catch (error) {
    debug(error)
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
module.exports.createMe = async (req, res) =>{
  try {
    await validateUser(req.body)
    const user = new User(req.body)
    user.password = hashPassword(user.password)
    user.role = (await Role.find({name:'user'}).lean())._id
    await user.save()
    delete user.password
    const token = oauthController.generateToken(user)
    res.status(200).json(token).end()
  } catch (error) {
    debug(error)
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
module.exports.getMe = async (req, res) => {
  try {
    const token = req.token
    const data = oauthController.getTokenData(token)
    const user = await User.findOne({_id: data._id}).lean()
    if(!user)
      throw new CustomError(404,'UserNotFound','Usuário não encontrado')
    res.status(200).json(user).end()
  } catch (error) {
    debug(error)
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
module.exports.updateMe = async (req, res) => {
  try {
    const token = req.token
    const data = oauthController.getTokenData(token)
    await validateUser(req.body, data._id)
    if(req.body.password){
      req.body.password = hashPassword(req.body.password)
    }
    await User.findByIdAndUpdate({_id:data._id,},{...req.body})
    const user = await User.findOne({_id:data._id},{password:0}).lean()
    if(!user){
      throw new CustomError(404,'UserNotFound','Usuário não encontrado')
    }
    const response = oauthController.generateToken(user)
    res.status(200).json(response).end()
  } catch (error) {
    debug(error)
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
module.exports.deleteMe = async (req, res) => {
  try {
    const token = req.token
    const data = oauthController.getTokenData(token)
    await User.deleteOne({_id:data._id})
    res.status(200).json("Usuário deletado com sucesso").end()
  } catch (error) {
    debug(error)
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