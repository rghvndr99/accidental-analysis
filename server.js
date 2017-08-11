var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var fs=require("fs");
var glob = require("glob");

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.listen(8080);

app.post('/getData',function(req,res){
    readFile(req.body.file).then(function(data){
        return res.json(data);
    }, function(error){
        return res.json(error);
    });
})

function readFile(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,function(err,data){
            if(err) return reject(err);
                   resolve(JSON.parse(data));
       });
    })     
 }

console.log('server started on port no 8080');