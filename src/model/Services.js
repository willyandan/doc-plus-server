const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  service:String
})
module.exports = mongoose.model('Service',model)