var mongoose=require('mongoose');

var TodoSchema=mongoose.Schema({
    name: {type: String,min:[6,"Name should be greater than 6"],required:[true,"There must be a name for your todo"]},
    completed: {type: Boolean,default: false},
    note: {type: String,required:[true,"You must provide a note"]},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date,default: null}
},{

});

var TodoModel=mongoose.model('Todo',TodoSchema);
module.exports=TodoModel;
