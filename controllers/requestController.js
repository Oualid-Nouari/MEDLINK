const requestModel = require("../models/Requests");
const patientModel = require("../models/patientModel");
const userModel = require("../models/user");
const jwt = require('jsonwebtoken');

const request_post = async (req, res) => {
    const {checkbox, sender, receiver} = req.body;
    await requestModel.create({sender, receiver, typeOfRequest: checkbox, status: false});
    const reqs = await requestModel.find();
}

const request_delete = async (req, res) => {
    const id = req.params.id;
    await requestModel.findByIdAndDelete(id);
    res.redirect('/dashboard');
}

const request_update = async (req, res) => {
    const id = req.params.id
    await requestModel.findByIdAndUpdate(id, {status: true}, {new: true});
    res.redirect('/dashboard');
}

const access_user = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        const patient = await patientModel.find();
        const user_patients = []
        patient.forEach((pat) => {
            if(id === pat.userId) {
                user_patients.push(pat);
            }
        })
        res.render('userDetails', {title: user.username, user, patients: user_patients});
    } catch(err) {
        console.log(err);
    }
}

const edit_access_user = async (req, res, next) => {
    const id = req.params.id;
    const token = req.cookies.user_token;
    let patientId = req.query;
    let patient = await patientModel.findById(patientId.id);
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function(err, decodedToken) {
            if(err) {
                next();
            } else {
                try {
                    const CurrentUser = await userModel.findById(decodedToken.id);
                    const user = await userModel.findById(id);
                    const patients = await patientModel.find();
                    const user_patients = []
                    patients.forEach((pat) => {
                        if(id === pat.userId) {
                            user_patients.push(pat);
                        }
                    })
                    res.render('editUserDetails', {title: user.username, accededUser: user, patients: user_patients, patient, CurrentUser});
                } catch(err) {
                    console.log(err);
                }
            }
        })
    }
}

module.exports = {request_post, request_delete, request_update, access_user, edit_access_user}

