var current_dir = "/";
var ls = [];
var selected_item = null;


function on_connect(){
    $.post("/ask_dir", {cd : current_dir}, (data)=>{

        ls = data;
        on_handshook();

    });
};

window.onload = on_connect;

Object.defineProperty(Array.prototype, 'end', {
    enumerable: false,
    value:function(val){ 
        this[this.length-1] = val;
    }
});
//----------------------------

function cd(loc){
    if(loc[loc.length-1] == "/"){
        var next_dir = current_dir + loc;
        $.post("/ask_dir", { cd : next_dir }, (data)=>{
            ls = data;
            current_dir = next_dir;
            if(current_dir != "/"){
                ls.push("..");
            }
            refresh();
        });
    }
    if(loc == ".."){
        var t = current_dir.split("/");
        t.pop();
        t.end("");
        var next_dir = t.join("/");
        $.post("/ask_dir", { cd : next_dir }, (data)=>{
            ls = data;
            current_dir = next_dir;
            if(current_dir != "/"){
                ls.push("..");
            }
            refresh();
        });

    }
}
function file(loc){

    select(ls.indexOf(loc));

    if(loc == "..") return;

    $("<div class='download' onclick='console.(\"cock\");'></div>");

    var download_button = document.createElement("div");
    download_button.className = "download";
    download_button.onclick = createCallback_1(pull,loc);
    download_button.innerHTML = "DOWNLOAD";

    var preview = document.createElement("div");
    preview.className="preview_box";
    // preview.innerHTML="PREVIEW";

    var icon = document.createElement("img");
    icon.src = "design/icons/"+getFileIco(loc);
    icon.style.width = "100%";
    icon.style.height = "100%";
    preview.appendChild(icon);

    var title = document.createElement("div");
    title.className="title";
    title.innerHTML=loc;

    $("#preview").html("");
    $("#preview").append($(download_button));
    $("#preview").append($(preview));
    $("#preview").append($(title));
    
    //clear it
    $("#preview").html("");
    
}
function pull(loc){
    console.log("pull: "+(current_dir+loc));
    
    // $.get("/ask_download",{ get : current_dir+loc }, (data)=>{
    //     console.log(data);
    // });
    window.open('/ask_download?get='+current_dir+loc);
}

function select(id){
    if(selected_item != null){
        selected_item.removeAttr("style");
    }
    $("#"+id).css({backgroundColor : "rgb(113,132,153)"});
    selected_item = $("#"+id);
}
function createCallback_1(func, arg){
    return ()=>{
        func(arg);
    };
}
function createCallback_2(func,arg1,arg2){
    return ()=>{
        func(arg1,arg2);
    };
}


var create_item = function(fn){

    var element = document.createElement("div");
    element.className = "item";
    element.id = ls.indexOf(fn);
    element.ondblclick = createCallback_1(cd,fn);
    element.onclick = createCallback_1(file,fn);;
    // element.innerHTML = fn;

    var icon = document.createElement("img");
    icon.src = "design/icons/"+getFileIco(fn);
    icon.style.height = "90%";
    icon.style.marginLeft = "3px";
    element.appendChild(icon);

    var name = document.createElement("span");
    name.innerHTML = fn;
    name.className = "item_name";
    name.style.marginLeft="8px";
    element.appendChild(name);

    return element;
}
function on_handshook(){
    refresh();
}

function refresh(){
    selected_item = null;
    $("#main").html("");
    ls = directory_handler.sort(ls);
    var parent = $("#main");
    for(i in ls){
        
        parent.append(create_item(ls[i]));
    }
    
}