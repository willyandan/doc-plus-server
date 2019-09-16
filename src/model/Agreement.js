const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  name: String,
  users:[
    {
      user:String,
      password:String, 
    }
  ],
  clinics:[
    {clinic:mongoose.Types.ObjectId}
  ]
})
module.exports = mongoose.model('Agreement',model)
