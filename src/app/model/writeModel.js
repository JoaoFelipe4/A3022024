const mongoose = require('mongoose')

const petSchema = mongoose.Schema({
    name: String,
    local: String,
    dono: String,
    dataDes: Date
},{timestamps:true})

module.exports = mongoose.model('pet',petSchema)