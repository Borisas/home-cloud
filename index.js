var express = require("express");
var app     = express();
var server  = require("http").Server(app);
var fs      = require("fs");
var path    = require("path");
var bodyParser = require('body-parser');
var zip = require("node-native-zip");

var configs = {
    port : 8080,
    cloud_drive : "./hdd"
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static('clientside'));
app.use(express.static('hdd'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+"/clientside/index.html"));
});
app.get('/index.html', (req,res)=>{
    res.sendFile(path.join(__dirname+"/clientside/index.html"));
});

app.post('/ask_dir', (req,res)=>{

    var loc = configs.cloud_drive+req.body.cd;

    var ls = fs.readdirSync(loc);
    var useful_ls = [];

    for( i in ls ){
        if(fs.lstatSync(loc+ls[i]).isDirectory()){
            useful_ls.push(ls[i]+"/");
        }else{
            useful_ls.push(ls[i]);
        }
    }

    res.send(useful_ls);
});

app.get('/ask_download', (req,res)=>{
    var file_to_get = path.join(__dirname+"/hdd"+ req.query.get);

    if(file_to_get[file_to_get.length-1] != "/" && file_to_get[file_to_get.length-1] != "\\"){
        var filename = file_to_get.split("\\");
        filename = filename[filename.length - 1];
        res.download(file_to_get, filename);
    }
    else{
        //folder
        var archive = new zip();

        archive.addFiles([ 
                { name: "moehah.txt", path: "./test/moehah.txt" },
                { name: "images/suz.jpg", path: "./test/images.jpg" }
            ], function (err) {
                if (err) return console.log("err while adding files", err);

                var buff = archive.toBuffer();

                fs.writeFile("./test2.zip", buff, function () {
                console.log("Finished");
            });
        });
    }
});

server.listen(configs.port, ()=>{
    console.log("Server online.");
    console.log("Port: " + configs.port);
});

//---------------------

var file_tree = function(folder){

};