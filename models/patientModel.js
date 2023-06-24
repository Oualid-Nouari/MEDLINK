const mongoose = require('mongoose');
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const now = new Date()
// const day = daysOfWeek[now.getDay()]
// const hours = now.getHours()
// const minutes = now.getMinutes()

const patientSchema = new mongoose.Schema({
    np: {
        type: String,
        required: true,
    },
    ipp: {
        type: String,
        required: [true, 'Ipp est obligatoire'],
        unique: true
    },
    cin: {
        type: String,
    },
    firstname: {
        type: String,
        required: [true, 'prénom est obligatoire!'],
    },
    lastname: {
        type: String,
        required: [true, 'nom est obligatoire!'],
    },
    userId: {
        type: String,
        required: true
    },
    couverture: {
        type: String,
    }
});

const patientModel = mongoose.model('patient', patientSchema);

module.exports = patientModel;