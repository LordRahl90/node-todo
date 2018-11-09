var express=require('express');
var todoRouter=express.Router();
var todoHandler=require('../handlers/TodoHandler');

todoRouter.get('/',todoHandler.loadAllTodos);
todoRouter.get('/:name',todoHandler.findItemByName);
todoRouter.get('/:id',todoHandler.findItemByID);

todoRouter.post('/',todoHandler.createNewTodo);

module.exports=todoRouter;