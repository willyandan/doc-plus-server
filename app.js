const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const debug = require('debug')('server:server');
require('dotenv').config()

const indexRouter = require('./routes/index');
const app = express();

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',()=>{
  debug('Erro ao se conectar ao banco')
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api',indexRouter)

app.use(express.static(path.join(__dirname, 'public')));

app.use('*',(req, res, next)=>{
  res.status(404).json({
    code:404,
    name:'PageNotFound',
    message:'Página não encontrada'
  }).end()
})
module.exports = app;
