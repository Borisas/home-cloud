
var explorer = {

    current_dir     :"/",
    ls              :[],
    selected_item   :null,

    load_files:function(p){
        this.ls = p;
    },
    cd:function(loc){

        var self = this;

        if(loc[loc.length-1] == "/"){
            var next_dir = explorer.current_dir + loc;
            $.post("/ask_dir", { cd : next_dir }, (data)=>{
                explorer.ls = data;
                explorer.current_dir = next_dir;
                if(explorer.current_dir != "/"){
                    explorer.ls.push("..");
                }
                explorer.refresh();
            });
        }
        if(loc == ".."){
            var t = explorer.current_dir.split("/");
            t.pop();
            t.end("");
            var next_dir = t.join("/");
            $.post("/ask_dir", { cd : next_dir }, (data)=>{
                explorer.ls = data;
                explorer.current_dir = next_dir;
                if(explorer.current_dir != "/"){
                    explorer.ls.push("..");
                }
                explorer.refresh();
            });

        }
    },
    file:function(loc){

        explorer.select(explorer.ls.indexOf(loc));

        if(loc == "..") return;

        $("<div class='download' onclick='console.(\"cock\");'></div>");

        var download_button = document.createElement("div");
        download_button.className = "download";
        download_button.onclick = createCallback_1(explorer.pull,loc);
        download_button.innerHTML = "DOWNLOAD";

        var preview = document.createElement("div");
        preview.className="preview_box";

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
        // $("#preview").html("");
        
    },
    pull:function(loc){
        console.log("pull: "+(explorer.current_dir+loc));
        
        $.get("/ask_download",{ get : explorer.current_dir+loc }, (data)=>{
            console.log(data);
            
        });
        window.open('/ask_download?get='+explorer.current_dir+loc);
    },
    select:function(id){
        if(selected_item != null){
            selected_item.removeAttr("style");
        }
        $("#"+id).css({backgroundColor : "rgb(113,132,153)"});
        selected_item = $("#"+id);
    },
    create_item:function(fn){

        var element = document.createElement("div");
        element.className = "item";
        element.id = explorer.ls.indexOf(fn);
        element.ondblclick = createCallback_1(explorer.cd,fn);
        element.onclick = createCallback_1(explorer.file,fn);

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
    },
    draw_path:function(path){
        parent = $(".location_bar");

        var t_str = "";
        for(i in path){
            var el = path[i];
            if(el === ""){
                t_str += ("home/");
                continue;
            }

            t_str += (el);
            if(i !== path.length-1){
                t_str+= "/";
            }
        }
        
        parent.html(t_str);
    },
	refresh:function(){
        selected_item = null;
        $("#main").html("");
        explorer.ls = directory_handler.sort(explorer.ls);
        var parent = $("#main");
        for(i in explorer.ls){
            
            parent.append(explorer.create_item(explorer.ls[i]));
        }
        var path = explorer.current_dir.split("/");
        path.pop();
        explorer.draw_path(path);
    }
};