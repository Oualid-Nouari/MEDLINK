const requestModel = require("../models/Requests");
const patientModel = require("../models/patientModel");
const userModel = require("../models/user");
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    const errors = {username: "", password: ""};
    if(err.message === 'Incorrect password') {
        errors.password = 'incorrect Password'
    }
    if(err.message === 'username not registered') {
        errors.username = 'Username not registred yet'
    }
    if(err.code === 11000) {
        errors.username = 'this username is already used!'
        return errors;
    }
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).map(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}
const maxAge = 3 * 60 * 60 * 24;
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET_KEY, {expiresIn: maxAge})
}

const signingup_post = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const user = await userModel.create({username, password});
        const token = createToken(user._id);
        res.cookie('user_token', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.json({user});
        next();
        
    } catch(err) {
        const errors = handleError(err);
        res.json({errors});
    }
}

const signup_post = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await userModel.create({username, password});
        res.json({user});
        
    } catch(err) {
        const errors = handleError(err);
        res.json({errors});
    }
}


const login_get = (req, res) => {
    res.render('login', {title: "login"});
}

const login_post = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const user = await userModel.login(username, password);
        const token = createToken(user._id);
        res.cookie('user_token', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.json({user});
        next();
    }
    catch(err) {
        const errors = handleError(err);
        res.json({errors});
    }
}

const logout_get = (req, res) => {
    res.cookie('user_token', '', {maxAge: 1});
    res.redirect('/');
}

const delete_user =  async (req, res) => {
    const id = req.params.id;
    let allPatients = await patientModel.find()
    try {
        await userModel.findByIdAndDelete(id);
        allPatients.map(async (patient) => {
            await patientModel.findOneAndDelete({userId: id.toString()});
        })
        await requestModel.findOneAndDelete({sender: id.toString()});
        await requestModel.findOneAndDelete({receiver: id.toString()});
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    }
}

module.exports = {signup_post, signingup_post, login_get, login_post, logout_get, delete_user};