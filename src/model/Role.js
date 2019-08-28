const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  name:String,
  scopes:[String]
})
module.exports = mongoose.model('Role',model)