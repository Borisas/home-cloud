var express = require("express");
var app     = express();
var server  = require("http").Server(app);
var fs      = require("fs");
var path    = require("path");
var bodyParser = require('body-parser');
var zip = require("node-native-zip");
var archiver = require('archiver');

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

        var traverse_tree = function(folder){
            var all_files = [];
            var ls = fs.readdirSync(folder);

            for(i in ls){
                var filename = folder+ls[i];
                var name = filename.slice(file_to_get.length,filename.length);
                if(fs.lstatSync(filename).isDirectory()){
                    var files_arr = traverse_tree(filename+"/");
                    for(j in files_arr){
                        all_files.push(files_arr[j]);
                    }
                }else{

                    all_files.push({name: path.join(name), path : path.join(filename)});
                }
            }
            return all_files;
        };

        var af = traverse_tree(file_to_get);
        console.log(af);
        // res.end();

        var archive = archiver('zip');

        archive.on('error', function(err) {
            res.status(500).send({error: err.message});
        });

        //on stream closed we can end the request
        archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
        });

        //set the archive name
        res.attachment('file.zip');

        //this is the streaming magic
        archive.pipe(res);

        var files = af;

        for(var i in files) {
            archive.file(files[i].path, files[i].name);
        }

        // var directories = [__dirname + '/fixtures/somedir']

        // for(var i in directories) {
        //     archive.directory(directories[i], directories[i].replace(__dirname + '/fixtures', ''));
        // }

        archive.finalize();

        // var archive = new zip();
        // archive.addFiles(
        //     af,
        //     function(err){
        //         if(err) return console.log("err while adding files", err);

        //         var buff = archive.toBuffer();

        //         buff.pipe(res);
        //     }
        // )

        // var output = fs.createWriteStream('target.zip');

        // var archive = new zip();

        // archive.addFiles(
        //     [ 
        //         { name: "moehah.txt", path: "./test/moehah.txt" },
        //         { name: "images/suz.jpg", path: "./test/images.jpg" }
        //     ], 
        //     function (err) {
        //         if (err) return console.log("err while adding files", err);

        //         var buff = archive.toBuffer();

        //         fs.writeFile("./test2.zip", buff, function () {
        //             console.log("Finished");
        //         });
        //     }
        // );
    }
});

server.listen(configs.port, ()=>{
    console.log("Server online.");
    console.log("Port: " + configs.port);
});

//---------------------

var file_tree = function(folder){

};