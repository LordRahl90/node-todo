var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Toto=require('../models/Todo');

router.get('/',function(req,res,next){
    Todo.find(function(err,todos){
        if(err) return next(err);
        res.json(todos);
    });
});

module.exports(router);