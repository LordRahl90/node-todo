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
            console.log(err);
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

    it("Tests a null Item entry",async()=>{
        let item=null;
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

describe("Find Items By Name and ID", ()=>{

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
        // await Todo.deleteMany({})
        mongoose.disconnect();
    });

    it("Find Item by name", async ()=>{
        try{
            let request=httpMocks.createRequest({
                method:"GET",
                url:"/api/todos/:id",
                params:{
                    name: "hello"
                }
            });
            let response=httpMocks.createResponse();

            await todoHandler.findItemByName(request,response);
            let responseData=JSON.parse(response._getData());

            expect(response._getStatusCode()).to.be.equal(200);
            expect(responseData.success).to.be.true;
            expect(responseData.data).to.not.be.null;
            expect(responseData.data._id).to.not.be.null;
        }
        catch(err){
            // console.log(err);
            expect(err).to.be.null;
        }
    });

    it("Find Item by wrong name", async ()=>{
        try{
            let request=httpMocks.createRequest({
                method:"GET",
                url:"/api/todos/wrong-name",
                params:{
                    name: "wrong-name"
                }
            });
            let response=httpMocks.createResponse();

            await todoHandler.findItemByName(request,response);
            let responseData=JSON.parse(response._getData());
            expect(responseData.data).to.be.null;

            expect(response._getStatusCode()).to.be.equal(200);
            expect(responseData.success).to.be.true
            
        }
        catch(err){
            console.log(err);
        }
    });


    it("Find Item by ID", async ()=>{
        try{
            let todoItem=await Todo.findOne({});
            let request=httpMocks.createRequest({
                method:"GET",
                url:"/api/todos",
                params:{
                    id: todoItem._id
                }
            });
            let response=httpMocks.createResponse();

            await todoHandler.findItemByID(request,response);
            var responseData=JSON.parse(response._getData());

            expect(response._getStatusCode()).to.be.equal(200);
            expect(responseData.success).to.be.true;
            expect(responseData.data).to.not.be.null;
            expect(responseData.data._id).to.not.be.null;
        }
        catch(err){
            console.log(err);
            expect(err).to.be.null;
        }
    });


    it("Find Item by Wrong ID", async ()=>{
        try{
            let wrongID=mongoose.Types.ObjectId();
            let request=httpMocks.createRequest({
                method:"GET",
                url:"/api/todos",
                params:{
                    id: wrongID
                }
            });
            let response=httpMocks.createResponse();

            await todoHandler.findItemByID(request,response);
            var responseData=JSON.parse(response._getData());

            expect(response._getStatusCode()).to.be.equal(200);
            expect(responseData.success).to.be.true;
            expect(responseData.data).to.equal(null);
        }
        catch(err){
            console.log(err);
        }
    });
});

describe("Test Updating Todo Information",()=>{
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
        await Todo.deleteMany({});
        mongoose.disconnect();
    });

    it("Attempts to make a successful update based on the provided ID",async ()=>{
        let todoItem=await Todo.findOne({});
        
        let request=httpMocks.createRequest({
            method:"PUT",
            url:"api/todo",
            params:{
                id:todoItem._id
            },
            body:{
                "name":"Adjustment",
                "note":"Test Adjustment note"
            }
        });
        let response=httpMocks.createResponse();
        try{
            await todoHandler.updateTodo(request,response);
            var responseData=JSON.parse(response._getData());
            expect(responseData.success).to.be.true;
            expect(responseData.message).to.not.equal(null);
            expect(response._getStatusCode()).to.be.equal(200);
        }
        catch(err){
            expect(err).to.be.null;
        }
    });


    it("Attempts to Update the same information",async ()=>{
        let todoItem=await Todo.findOne({});
        
        let request=httpMocks.createRequest({
            method:"PUT",
            url:"api/todo",
            params:{
                id:todoItem._id
            },
            body:todoItem
        });
        let response=httpMocks.createResponse();
        try{
            await todoHandler.updateTodo(request,response);
            var responseData=JSON.parse(response._getData());

            expect(responseData.success).to.be.true;
            expect(responseData.message).to.not.equal(null);
            expect(response._getStatusCode()).to.be.equal(200);
        }
        catch(err){
            expect(err).to.be.null;
        }
    });

    it("Attempts to update a value with wrong ID but valid body content. This should upsert though.",async()=>{
        let request=httpMocks.createRequest({
            method:"PUT",
            url:"api/todo",
            params:{
                id:mongoose.Types.ObjectId()
            },
            body:{
                "name":"Adjustment",
                "note":"Test Adjustment note"
            }
        });
        let response=httpMocks.createResponse();
        try{
            await todoHandler.updateTodo(request,response);
            var responseData=JSON.parse(response._getData());
            expect(responseData.success).to.be.true;
            expect(responseData.message).to.not.equal(null);
            expect(responseData.data).not.null;
            expect(response._getStatusCode()).to.be.equal(200);
        }
        catch(err){
            expect(err).to.be.null;
        }
    });

    it('Attempts to make an update with a wrong ID and wrong content',async()=>{
        let request=httpMocks.createRequest({
            method:"PUT",
            url:"api/todo",
            params:{
                id:mongoose.Types.ObjectId()
            },
            body:{
                "names":"Adjustment",
                "noted":"Test Adjustment note"
            }
        });
        let response=httpMocks.createResponse();
        try{
            await todoHandler.updateTodo(request,response);
            var responseData=JSON.parse(response._getData());
        
            expect(responseData.success).to.be.false;
            expect(responseData.message).to.not.equal("");
            expect(responseData.data).not.null;
            expect(responseData.data.note).to.not.be.null;
            expect(responseData.data.name).to.not.be.null;
            expect(response._getStatusCode()).to.be.equal(400);
        }
        catch(err){
            expect(err).to.be.null;
        }
    });


    it('Attempts to make an update with a wrong ID and null parameter',async()=>{
        let request=httpMocks.createRequest({
            method:"PUT",
            url:"api/todo",
            params:{
                id:mongoose.Types.ObjectId()
            },
            body:null
        });
        let response=httpMocks.createResponse();
        try{
            await todoHandler.updateTodo(request,response);
            var responseData=JSON.parse(response._getData());
        
            expect(responseData.success).to.be.false;
            expect(responseData.message).to.not.equal("");
            expect(responseData.data).not.null;
            expect(responseData.data.note).to.not.be.null;
            expect(responseData.data.name).to.not.be.null;
            expect(response._getStatusCode()).to.be.equal(400);
        }
        catch(err){
            expect(err).to.be.null;
        }
    });
});