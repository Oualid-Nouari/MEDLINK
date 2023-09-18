const jwt = require('jsonwebtoken');
const userModel = require('../models/user');


const authRequired = (req, res, next) => {
    const token = req.cookies.user_token;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function(err){
            if(err) {
                res.redirect('/login')
            } else {
                next();
            }
        })
    } else {
        res.redirect('login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.user_token;
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function(err, decodedToken){
            if(err) {
                next();
            } else {
                const user = await userModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { authRequired, checkUser }