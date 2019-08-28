const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  email:String, 
  password:String,
  name:String,
  role:mongoose.Types.ObjectId
})
module.exports = mongoose.model('Admin',model)