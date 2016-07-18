function on_connect(){
    $.post("/ask_dir", {cd : explorer.current_dir}, (data)=>{

        explorer.load_files(data);
        on_handshook();

    });
    initUpload();
};
function on_handshook(){
    explorer.refresh();
};
window.onload = on_connect;

Object.defineProperty(Array.prototype, 'end', {
    enumerable: false,
    value:function(val){ 
        this[this.length-1] = val;
    }
});



function initUpload(){
    document.addEventListener("drop",function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    var dropArea = document.getElementById('droparea');
    
    dropArea.addEventListener("drop", function(event){
        console.log("drop detected");
        event.preventDefault();
        var items = event.dataTransfer.items;
        for(var i = 0; i < items.length; i++){
            var item = items[i].webkitGetAsEntry();
            if(item){
                traverseFileTree(item);
            }
        }
    });
    dropArea.addEventListener('dragenter', function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    dropArea.addEventListener('dragleave', function(e){
    });
}