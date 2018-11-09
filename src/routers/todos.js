var express=require('express');
var todoRouter=express.Router();
var todoHandler=require('../handlers/TodoHandler');

todoRouter.get('/',todoHandler.loadAllTodos);
todoRouter.post('/',todoHandler.createNewTodo);

module.exports=todoRouter;