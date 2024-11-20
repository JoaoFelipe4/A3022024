const mongoose = require('mongoose')

const petSchema = mongoose.Schema({
    name: String,
    local: String,
    dono: String,
    lat: Float64Array,
    lng: Float64Array,
    dataDes: Date,
    image: String,
    imageUrl: String
},{timestamps:true})

module.exports = mongoose.model('pet',petSchema)