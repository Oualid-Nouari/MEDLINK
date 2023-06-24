const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    }, 
    receiver: {
        type: String,
        required: true
    }, 
    typeOfRequest: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: false
    }
})

const requestModel = mongoose.model('request', requestSchema);

module.exports = requestModel;