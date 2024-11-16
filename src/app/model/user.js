const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nome : {type:String,required:true},
    senha : {type:String,required:true},
    email : {type:String,required:true,unique:true},
    dataNasc : {type:Date,required:true},
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)