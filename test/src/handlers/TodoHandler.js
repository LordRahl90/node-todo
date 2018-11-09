const assert=require('assert');
let expect=require('chai').expect;
const httpMocks=require('node-mocks-http');
const todoHandler=require('../../../src/handlers/TodoHandler');

describe("Todo API Integration Test",function(){
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

    it("Should return List of Todos",async ()=>{
        const request=httpMocks.createRequest({
            method:"GET",
            url:"/api/todo"
        });

        let response=httpMocks.createResponse();
        try{
            await todoHandler.loadAllTodos(request,response);
            var responseData=JSON.parse(response._getData());

            expect(responseData.success).to.be.true;
            expect(responseData.data.length).to.be.equal(2);
        }
        catch(err){
            expect(err).to.be.equal(null);
        }
    });
});

describe("Fetch Empty List of Todos",()=>{
    before(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
    });
    after(function(){
        mongoose.disconnect();
    });
    it("Should return empty List of Todos",async ()=>{
        const request=httpMocks.createRequest({
            method:"GET",
            url:"/api/todo"
        });

        let response=httpMocks.createResponse();
        try{
            await todoHandler.loadAllTodos(request,response);
            var responseData=JSON.parse(response._getData());

            expect(response._getStatusCode()).to.be.equal(200);
            expect(responseData.success).to.be.true;
            expect(responseData.data.length).to.be.equal(0);
        }
        catch(err){
            // console.log(err);
            expect(err).to.be.equal(null);
        }
    });
});

describe("Create a new Todo Item", ()=>{
    before(function(){
        mongoose.connect("mongodb://localhost/todo-api-test",{ useNewUrlParser: true });
    });
    after(async function(){
        await Todo.deleteMany({});
        mongoose.disconnect();
    });

    it("Describes Creating a valid todo Item", async ()=>{
        let item={
            "name":"Valid Item",
            "note":"My Note is here"
        };

        try{
            let request=httpMocks.createRequest({
                method: "POST",
                url: "/api/todo",
                body: item
            });
            let response=httpMocks.createResponse();
            await todoHandler.createNewTodo(request,response);
            var responseData=JSON.parse(response._getData())
            expect(response._getStatusCode()).to.be.equal(201);
            expect(responseData.success).to.be.true;
            expect(responseData.data).to.not.be.equal(null);
            expect(responseData.data._id).to.not.be.equal(undefined);
            
        }
        catch(err){
            // console.log(err);
            expect(err).to.be.equal(null);
        }
    });

    it("Tests an Invalid Item entry",async()=>{
        let item={
            "names":"Valid Item",
            "notes":"My Note is here"
        };

        try{
            let request=httpMocks.createRequest({
                method: "POST",
                url: "/api/todo",
                body: item
            });
            let response=httpMocks.createResponse();
            await todoHandler.createNewTodo(request,response);
            var responseData=JSON.parse(response._getData())
            
            expect(response._getStatusCode()).to.be.equal(400);
            expect(responseData.name).to.not.be.equal(null);
            expect(responseData.note).to.not.be.equal(null);
        }
        catch(err){
            expect(err).to.be.equal(null);
        }
    });

    it("Tests an Undefined or empty Item entry",async()=>{
        let item={};

        try{
            let request=httpMocks.createRequest({
                method: "POST",
                url: "/api/todo",
                body: item
            });
            let response=httpMocks.createResponse();
            await todoHandler.createNewTodo(request,response);
            var responseData=JSON.parse(response._getData())
            
            expect(response._getStatusCode()).to.be.equal(400);
            expect(responseData.name).to.not.be.equal(null);
            expect(responseData.note).to.not.be.equal(null);
        }
        catch(err){
            expect(err).to.be.equal(null);
        }
    });
});