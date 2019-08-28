const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  email:String, 
  password:String,
  name:String, 
  birthDay:Date,
  // agreement:mongoose.Types.ObjectId,
  address:{
    state:String,
    city:String,
    street:String,
    neighborhood:String,
    number:String,
    complement:String,
    zip:String
  },
  role:mongoose.Types.ObjectId
})
module.exports = mongoose.model('User',model)