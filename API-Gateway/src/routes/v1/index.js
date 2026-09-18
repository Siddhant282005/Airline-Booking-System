const express=require('express');

const router=express.Router();
const { AuthRequestMiddleware }=require('../../middlewares');
const {InfoController }=require('../../controllers');
const UserRoutes=require('./user-routes');

router.get('/info',AuthRequestMiddleware.checkAuth,InfoController.info);
router.use('/user',UserRoutes);

module.exports=router;