const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  address:{
    country:String,
    state:String,
    city:String,
    street:String,
    number:String,
    complement:String,
    zip:String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  services:[{
    type:String
  }]
})

// const index = {
//   name:'text',
//   // 'address.*':'text',
//   // 'services':'text'
// }
model.index({
  '$**':'text'
},{
  weights:{
    name:7,
    'address.country':1,
    'address.state':1,
    'address.city':2,
    'address.street':3,
    'address.number':3,
    'address.complement':1,
    'address.zip':1,
    services:3
  }
})

module.exports = mongoose.model('Clinica',model)