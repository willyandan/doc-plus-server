const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  name: String,
  users:[
    {
      login:String,
      senha:String,
      role:mongoose.Types.ObjectId
    }
  ],
  clinics:[
    {clinic:mongoose.Types.ObjectId}
  ]
})
module.exports = mongoose.model('Agreement',model)