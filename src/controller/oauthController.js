const express = require('express')
const User = require('../model/User')
const CustomError = require('./CustomError')
const debug = require('debug')('server:user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function validateBcrypt(hashedvalue, value){
  return bcrypt.compareSync(value,hashedvalue)
}

function generateToken(data){
  const token = jwt.sign({
    data,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  },process.env.JWT_PASSWORD)
  const decode = jwt.decode(token)
  return {
    token,
    decode
  }
}

function getTokenData(token){
  const decode = jwt.decode(token)
  return decode.data
}

module.exports.generateToken = generateToken
module.exports.validateBcrypt = validateBcrypt
module.exports.getTokenData = getTokenData
