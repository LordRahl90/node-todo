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
    },
    findItemByName: async function(req,res){
        let result=await service.findTodoByName(req.params["name"]);
        res.json({
            success: true,
            data: result
        });
    },
    findItemByID: async function(req,res){
        let result=await service.findTodoByID(req.params["id"]);
        res.json({
            success: true,
            data: result
        });
    },
    updateTodo: async function(req,res){
        try{
            let id=req.params["id"];
            let item=req.body;
            item._id=id;
            result=await service.updateTodo(item);
            if(result.nModified==undefined && result._id!==null && result._id!==undefined){
                res.json({
                    success: true,
                    message: "New Item has been added",
                    data: result
                });
            }
            else{
                res.json({
                    success: true,
                    message: result.nModified+" update(s) made",
                    data:{}
                });
            }
        }
        catch(err){
            let errMessage={};
            for(let key in err){
                errMessage[key]=err[key].message;
            }
            res.status(400).json({
                success: false,
                message: "Validation Issues",
                data:errMessage
            });
        }
    }
}

//commonwealth text and win promo.
module.exports =todoHandler;