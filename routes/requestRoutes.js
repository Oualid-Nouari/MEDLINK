const express = require('express');
const {request_post, request_delete, request_update, access_user, edit_access_user} = require('../controllers/requestController');
const requestRouter = express.Router();

requestRouter.post('/user/send-request', request_post);
requestRouter.get('/request/delete/:id', request_delete);
requestRouter.get('/request/access/:id', request_update);
requestRouter.get('/dashboard/user/:id', access_user);
requestRouter.get('/dashboard/edit/user/:id', edit_access_user)

module.exports = requestRouter;