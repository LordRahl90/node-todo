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
    }
};

module.exports=todoService;