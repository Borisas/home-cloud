
var directory_handler = {
    sort : function(file_arr){
        var directories = [];
        var files = [];
        var back = "";
        
        for(i in file_arr){
            var item = file_arr[i];

            if(item[item.length-1] == "/"){
                directories.push(item);
            }else if(item != ".."){
                files.push(item);
            }else if(item == ".."){
                back = "..";
            }
        }

        directories.sort();
        files.sort();

        var ret = [];

        if(back!= "")
            ret.push(back);

        for(i in directories){
            ret.push(directories[i]);
        }
        for(i in files){
            ret.push(files[i]);
        }

        return ret;
    }
};