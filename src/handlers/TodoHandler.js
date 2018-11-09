// 'use strict';

let service=require('../services/TodoService');

todoHandler={
    loadAllTodos: async function(req,res){
        let todos=await service.listAllTodos();
        return res.status(200).json({
            success: true,
            count:todos.length,
            data: todos
        });
    },
    createNewTodo: async function(req,res){
        try{
            newPost=await service.createNewTodo({
                name: req.body.name,
                note: req.body.note
            });
            res.status(201).json({
                success:true,
                data: newPost
            });
        }
        catch(err){
            let errMessage={};
            for(let key in err){
                errMessage[key]=err[key].message;
            }
            res.status(400).json(errMessage);
        }
    }
}

module.exports =todoHandler;