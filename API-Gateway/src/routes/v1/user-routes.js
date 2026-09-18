const express = require('express');
const {UserController}=require('../../controllers');
const {AuthRequestMiddleware}=require('../../middlewares');
const router=express.Router();

router.post('/signup',AuthRequestMiddleware.validateAuthRequest,UserController.signup);
router.post('/signin',AuthRequestMiddleware.validateAuthRequest,UserController.signin);

router.post('/role',AuthRequestMiddleware.checkAuth,AuthRequestMiddleware.isAdmin,UserController.addRoleToUser);
router.get('/',AuthRequestMiddleware.checkAuth,AuthRequestMiddleware.isAdmin,UserController.getAllUsers);
module.exports=router;
