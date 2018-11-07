mongoose=require('mongoose');
Todo=require('../models/Todo');

var todoService={

    createNewTodo: async function(item) {
        if(item==undefined || item==null){
            return "Invalid Item Provided";
        }
        let newTodo=new Todo(item);
        return new Promise((resolve,reject)=>{
            return newTodo.validate(function(err){
                if(err){
                    return reject(err.errors);
                }else{
                    newTodo.save();
                    return resolve(newTodo);
                }
            });
        });
    },

    listAllTodos: async function(){
        let result=await Todo.find({});
        return result;
    },
    findTodoByName: async function(name){
        let result=await Todo.findOne({name:name})
        return result;
    },
    findTodoByID: async function(id){
        let result=await Todo.findById(id);
        return result;
    }

};

module.exports=todoService;