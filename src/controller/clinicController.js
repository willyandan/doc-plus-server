const CustomError = require('./CustomError')
const debug = require('debug')('server:create')
const express = require('express')
const Clinic = require('../model/Clinic')

function getClinicDoc(body){
  const doc = {}
  if(!body.name) throw new CustomError(400,'InvalidRequest','É preciso enviar um nome')
  doc.name = body.name
  if(!body.address) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço')
  doc.address = {}

  if(!body.address.country) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.country = body.address.country
  
  if(!body.address.state) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.state = body.address.state
  
  if(!body.address.city) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.city = body.address.city
  
  if(!body.address.street) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.street = body.address.street
  
  if(!body.address.number) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.number = body.address.number
  
  if(body.address.complement)
    doc.address.complement = body.address.complement
  
  if(!body.address.zip) throw new CustomError(400,'InvalidRequest','É preciso enviar um endereço valido')
  doc.address.zip = body.address.zip

  if(!body.location) throw new CustomError(400, 'InvalidRequest','É preciso enviar uma localização')
  doc.location = {
    type:'Point',
    coordinates: []
  }
  if(!body.location.lat) throw new CustomError(400, 'InvalidRequest','É preciso enviar uma localização')
  doc.location.coordinates.push(body.location.lat)

  if(!body.location.long) throw new CustomError(400, 'InvalidRequest','É preciso enviar uma localização')
  doc.location.coordinates.push(body.location.long)

  if(body.services)
    doc.services = body.services
  return doc
}

function getClinicQuery(params){
  /**
   * IMPLEMENTAR OR WHERE PRA VER QQ DA
   */
  let query = {}
  if(params.name){
    query.name = RegExp(params.name,'ig')
  }
  if(params.zip){
    query["address.zip"] = RegExp(params.zip,'g')
  }
  if(params.service){
    query.services = RegExp(params.service,'ig')
  }
  return query
}

function getClinicSearchQuery(q, coords=[]) {
  let query = {
    $text:{
      $search:q
    },
    location:{
      $geoWithin:{
        $centerSphere:[coords, 0.00627139685]
      }
    }
  }
  debug(query)
  return query
}

function updateClinicDoc(clinic, body) {
  const doc = {}
  if(body.name)
    clinic.name = body.name
  if(body.address){
    if(body.address.country)
      clinic.address.country = body.address.country
    
    if(body.address.state)
      clinic.address.state = body.address.state
    
    if(body.address.city)
      clinic.address.city = body.address.city
    
    if(body.address.street)
      clinic.address.street = body.address.street
    
    if(body.address.number)
      clinic.address.number = body.address.number
    
    if(body.address.complement)
      doc.address.complement = body.address.complement
    
    if(body.address.zip)
      clinic.address.zip = body.address.zip
  }
  
  

  if(body.location){
    clinic.location = {
      type:"Point",
      coordinates: [body.location.lat, body.location.long]
    }
  }

  if(body.services)
    clinic.services = body.services
  return clinic
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.list = async function(req, res){
  try {
    const query = getClinicQuery(req.query)
    const clinics = await Clinic.find(query)
    
    res.status(200).json(clinics).end()
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.search = async function(req, res){
  try {
    if(!req.query.q){
      throw new CustomError(400,'InvalidRequest','É necessário mandar um termo de busca')
    }
    let page = req.query.page || 1
    if(page <= 0) page = 1
    const query = getClinicSearchQuery(req.query.q, [req.query.lat, req.query.long])
    const clinics = await Clinic.find(query,{score: {$meta: "textScore"},})
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .skip(10 * (page - 1))
    const last_page = Math.ceil(await Clinic.count(query) / 10)
    res.status(200).json({
      clinics:clinics,
      last_page:last_page,
      page:page
    }).end()
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.create = async function(req, res){
  try {
    const body = getClinicDoc(req.body)
    const clinic = new Clinic(body)
    await clinic.save()
    res.status(200).json(clinic).end()
    debug('success')
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }

}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.read = async function(req, res){
  try {
    const id = req.params.id
    const clinic = await Clinic.findOne({_id:id})
    
    if(!clinic){
      throw new CustomError(404,'ClinicNotFound','Clinica não encontrada')
    }
    res.status(200).json(clinic).end()
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.update = async function(req, res){
  try {
    const hasClinic = await Clinic.exists({
      _id:{$ne:req.params.id},
      name:req.body.name
    })
    if(hasClinic){
      throw new CustomError(403,'DuplicatedClinic','O nome da clinica já existe')
    }
    let clinic = await Clinic.findOne({_id:req.params.id})
    if(!clinic){
      throw new CustomError(404,'ClinicNotFound','Clinica não encontrada')
    }
    clinic = updateClinicDoc(clinic,req.body)
    await clinic.save()
    res.status(200).json(clinic).end()
    debug('success')
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }
}

/**
 * @param {express.request} req
 * @param {express.response} res
 */
module.exports.delete = async function(req, res){
  try {
    await Clinic.deleteOne({_id:req.params.id})
    res.status(200).json("Clinica deletado com sucess").end()
  } catch (error) {
    debug(error)
    if(error instanceof CustomError){
      res.status(error.code).json({
        code:error.code,
        name:error.name,
        message:error.name
      })
    }else{
      res.status(500).json({
        code:500,
        name:"InternalError",
        message:'Erro interno'
      })
    }
  }
}