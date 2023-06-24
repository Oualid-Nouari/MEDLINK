const express = require('express');
const { signup_post, login_get, login_post, logout_get, delete_user, signingup_post} = require('../controllers/authController')
const authRouter = express.Router();

authRouter.post('/signup', signup_post);
authRouter.post('/signingup', signingup_post);

authRouter.get('/login', login_get);
authRouter.post('/login', login_post);

authRouter.get('/logout', logout_get);

authRouter.get('/users/delete/:id', delete_user);

module.exports = authRouter;