var express=require('express');
var todoRouter=express.Router();
var service=require('../services/TodoService')

todoRouter.get('/',async function(req,res){
    try{
        let todos=await service.listAllTodos();
        res.json({
            success: true,
            count:todos.length,
            data: todos
        });
    }
    catch(err){
        res.json(err).statusCode(500);
    }
});
todoRouter.post('/', async function(req,res){
    try{
        newPost=await service.createNewTodo({
            name: req.body.name,
            note: req.body.note
        });
        res.json({
            success:true,
            data: newPost
        });
    }
    catch(err){
        res.json(err.message).statusCode(500)
    }
});

module.exports=todoRouter