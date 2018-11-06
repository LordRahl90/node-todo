
logging=function(req,res,next){
    console.log("Request Type is: "+req.method);
    console.log("Remote connection is: "+req.connection.remoteAddress);
    next();
}


testMid=function(req,res,next){
    console.log("This is from the test mid");
    console.log(req.connection.hostname);
    next();
}

module.exports =logging;