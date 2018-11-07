var mongoose=require('mongoose');
var express=require('express');
var app=express();
let bodyParser=require('body-parser')
logger=require('./src/middlewares/logger');
var morgan=require('morgan');
var fs=require('fs');
var path=require('path');
var rfs=require('rotating-file-stream');
var todoRouter=require('./src/routers/todos')


var logDir=path.join(__dirname,'log');

fs.existsSync(logDir) || fs.mkdirSync(logDir);

var accessLogStream=rfs('access.log',{
    interval:'1d',
    path: logDir
});

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/todo-api',{useNewUrlParser:true}).then(()=>{console.log("Connection successful!")}).catch((err)=>console.log(err));


app.use(morgan('combined',{stream: accessLogStream}));
app.use(bodyParser.json())
// app.use(logger);
// app.use(testMid);


/**
 * This should retrieve all the TODOS in the db.
 */
app.get('/',function(req,res){
    res.json("Hello World!");
});

app.post('/',function(req,res){
    console.log("Hello World");

    res.json("I see you want to add a todo.");
});

app.use('/api/todo',todoRouter);

app.listen(3000,function(){
    console.log("App Listening on port 3000");
});