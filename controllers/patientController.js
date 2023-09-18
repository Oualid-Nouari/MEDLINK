const patientModel = require("../models/patientModel");
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");

const handleErrors = (err) => {
    const errors =  {np: "", ipp: "", cin: "", firstname: "", lastname: ""};
    if(err.code === 11000) {
        errors.ipp = "Ipp already used!"
        return errors
    }
    if(err.message.includes('patient validation failed') ) {
        Object.values(err.errors).map(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const patient_post = async (req, res, next) => {
    let {ipp, cin, firstname, lastname, couverture} = req.body;
    let allPatient = await patientModel.find();
    const token = req.cookies.user_token;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function(err, decodedToken){
            if(err) {
                next();
            } else {
                const user = await userModel.findById(decodedToken.id);
                try {
                    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                    let patient = await patientModel.create(
                        {
                            userId: user._id ,np: allPatient.length + 1, ipp, cin, firstname, lastname, couverture, createdAt: `${daysOfWeek[new Date().getDay()]}, ${new Date().getHours()}:${new Date().getMinutes()}`
                        });
                    res.json({patient});
                } catch(err) {
                    const errors = handleErrors(err);
                    res.json({errors})
                }
            }
        })
    } else {
        next();
    }
}

const patient_get = async (req, res) => {
    const id = req.params.id
    const patient = await patientModel.findById(id);
    res.render('detail', {title: patient.firstname, patient});
}

const patient_delete = async (req, res) => {
    const id = req.params.id;
    try {
        await patientModel.findByIdAndDelete(id);
        res.redirect('/dashboard');
    }
    catch(err) {
        console.log(err);
    }
}

const patient_update = async (req, res) => {
    const {np, ipp, cin, firstname, lastname, couverture} = req.body;
    try {
        await patientModel.findOneAndUpdate({np}, {ipp, cin, firstname, lastname, couverture}, {new: true});
    } catch(err) {
        console.log(err)
    }
}

module.exports = {patient_post, patient_delete, patient_get, patient_update};