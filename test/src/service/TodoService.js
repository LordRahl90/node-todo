
var expect=require('chai').expect;
var service=require('../../../src/services/TodoService');
var sinon=require('sinon');
var Todo=require('../../../src/models/Todo');

describe("Create a new TodoItem", function(){
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

    it("Describes a failed todo with undefined item supplied",async function(){
        actual=await service.createNewTodo();
        expect(actual).equals("Invalid Item Provided");
    });

});


describe("listAllTodos()", function(){
    it("Test the listings of all todo Items available in the database", async function(){
        this.timeout(5000);
        let expectedTotalItems=1;

        Todo.create({
            "name":"Test Note",
            "note":"Hello World",
        },function(err,todo){
            if(err) console.log(err);
            else console.log(todo);
        });
        
        // try{
        //     let actual=await service.listAllTodos();
        //     console.log(actual);
        // }
        // catch(err){
        //     console.log(err);
        // }
    });
});

describe('showATodo()',function(){
    it('Show a Single todo', function(){
        var item={
            id: "12345",
            name:"Hello World",
            completed: false,
            note: "Hello World, todo. This is a brief note though",
            created_at: "2018-01-01 20:00:00",
            updated_at: "2018-11-05 12:00:00"
        };
        let expected=item;
        let id="50412345030";
        let actual=service.getOneTodo(id);

        expect(actual).greaterThan(0);
        expect(actual).to.contain({id});
    });
});


describe("updateTodo()", function(){
    it("Test The Update of a todo item, This should also be able to test for upserts.",function(){
        var item={
            id: "12345",
            name:"Hello World",
            completed: false,
            note: "Hello World, todo. This is a brief note though",
            created_at: "2018-01-01 20:00:00",
            updated_at: "2018-11-05 12:00:00"
        };

        actual=service.updateTodo(item);

    });
});


describe("deleteTodo()", function(){
    it("Test Removal of a todo item", function(){
        let id="1234567890";
        actual=service.deleteTodo(id);
    });
});