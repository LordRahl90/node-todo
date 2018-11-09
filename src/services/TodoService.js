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
    },
    updateTodo: async function(item){
        let dbItem=await Todo.findOne({_id:item._id});
            if(dbItem==null){
                item.updated_at=Date.now();
                return this.createNewTodo(item);
            }else{
                if(item.note==null){
                    item.note=dbItem.note;
                }
                if(item.name==null){
                    item.name=dbItem.name;
                }
        
                let result=await Todo.updateOne({_id:item._id},
                    {
                        name:item.name,
                        note:item.note,
                        updated_at:Date.now()
                    });
                return result;
            }
    },
    deleteTodo: async function(item){
        let result=await Todo.deleteOne({_id: item._id});
        return result;
    }

};

module.exports=todoService;