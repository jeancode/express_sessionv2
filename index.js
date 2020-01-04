var express =  require("express")
var https =  require("https");
var app =  express();

var fs =  require("fs");

var home = require("./router.js");

app.use('/', home);


var ssl = {
    key:fs.readFileSync('./server.key'),
    cert:fs.readFileSync('./server.cert')
};

const server   = https.createServer(ssl, app);


app.get('/',function(req,res){
    res.sendfile("./app/index.html");
});

server.listen(443,function(){
    console.log("Servidor Listo");
});


