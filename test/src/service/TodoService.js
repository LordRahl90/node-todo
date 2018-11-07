
var expect=require('chai').expect;
var service=require('../../../src/services/TodoService');
var sinon=require('sinon');
var mongoose=require('mongoose');
var Todo=require('../../../src/models/Todo');
    

describe("Create a new TodoItem", function(){
    this.beforeAll(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
    });

    this.afterAll(async function(){
        await Todo.deleteMany({})
        mongoose.disconnect();
    });

    it("Test The creation of a todo item",async function(){
        var item={
            name:"Hello World",
            note: "Hello World, todo. This is a brief note though",
        };
        
        try{
            actual=await service.createNewTodo(item);
            expect(actual._id).is.not.equals(null);
            expect(actual.name).is.equals(item.name);
        }
        catch(err){
            expect(err).is.equals(null);
        }
    });

    it("Tests The creation of a todo item with bad schema",async function(){
        var item={
            title: "Test Title"
        };
        
        try{
            actual=await service.createNewTodo(item);
            expect(actual).equals(null);
        }
        catch(err){
            expect(err).is.not.equals(null);
            expect(err["name"].message).equals("There must be a name for your todo");
            expect(err["note"].message).equals("You must provide a note");
        }
    });

    it("Tests the creation of new todo item without a schema",async function(){
        actual=await service.createNewTodo();
        expect(actual).equals("Invalid Item Provided");
    });
});

describe("listAllTodos()", function(){
    before(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
        todos=[
            {
                "name":"hello",
                "note":"world"
            },
            {
                "name":"Hello again",
                "note":"Another Note"
            }
        ];
        return Todo.insertMany(todos);
    });
    after(async function(){
        await Todo.deleteMany({})
        mongoose.disconnect();
    });

    it("Test the listings of all todo Items available in the database", async function(){
        try{
            let actual=await service.listAllTodos();
            expect(2).to.equals(actual.length);
            expect(actual[0].name).equals("hello");
        }
        catch(err){
            console.log(err);
        }
    });
});

describe("empty show listings",function(){
    before(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
    });
    after(async function(){
        await Todo.deleteMany({})
        mongoose.disconnect();
    });

    it("Test lisitngs if items are not available in the database",async function(){
        try{
            let actual=await service.listAllTodos();
            expect(actual.length).to.equals(0);
            expect(actual[0]).equals(undefined);
        }
        catch(err){
            expect(err).not.equals(null);
        }
    });
});

describe('showATodo()',function(){
    var id=[];
    this.beforeAll(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
        todos=[
            {
                "name":"hello",
                "note":"world"
            },
            {
                "name":"Hello again",
                "note":"Another Note"
            }
        ];

        Todo.insertMany(todos).then(function(item){
            id.push(item);
        });
    });

    this.afterAll(async function(){
        await Todo.deleteMany({})
        mongoose.disconnect();
    });

    it('Find a todo by name', async function(){
        try{
            let actual=await service.findTodoByName("hello");

            expect(actual.length).equals(undefined);
            expect(actual).not.equals(undefined);
            expect(actual._id).not.equals(null);
        }
        catch(ex){
            console.log(ex);
        }
    });

    it('Find a todo by a name that is not present', async function(){
        try{
            let actual=await service.findTodoByName("Invalid name");
            expect(actual).equals(null);
        }
        catch(ex){
            console.log(ex);
        }
    });

    it('Finds a todo by ID',async function(){
        try{
            let todoID=await Todo.findOne({});
            let actual=await service.findTodoByID(todoID._id);
            expect(actual).not.equals(null);
            expect(actual._id).not.equals(null);
        }
        catch(ex){
            console.log(ex);
        }
    });

    it('Finds a todo by invalid ID',async function(){
        try{
            let actual=await service.findTodoByID("invalid_id");
            expect(actual).equals(null);
            expect(actual._id).not.equals(undefined);
        }
        catch(ex){
            expect(ex).is.not.null;
        }
    });

    it('Finds a todo by invalid Object ID',async function(){
        try{
            let invalid=mongoose.Types.ObjectID();
            let actual=await service.findTodoByID(invalid);
            expect(actual).equals(null);
            expect(actual._id).not.equals(undefined);
        }
        catch(ex){
            expect(ex).is.not.null;
        }
    });
});

// describe("updateTodo()", function(){
//     it("Test The Update of a todo item, This should also be able to test for upserts.",function(){
//         actual=service.updateTodo(item);
//     });
// });


// describe("deleteTodo()", function(){
//     it("Test Removal of a todo item", function(){
//         actual=service.deleteTodo(id);
//     });
// });
