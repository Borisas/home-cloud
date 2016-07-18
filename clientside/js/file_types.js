function getFileType(file){

    if(_is(file, image_types)){                 //IMAGE
        return "image";
    }else if(_is(file,audio_types)){            //AUDIO
        return "audio";
    }else if(_is(file,movie_types)){            //MOVIE
        return "movie";
    }else if(_is(file,doc_types)){              //DOCUMENT
        return "document";
    }else if(_is(file,code_types)){             //CODE
        return "code";
    }else if(_is(file,archive_types)){          //ARCHIVE
        return "archive"
    }else if(file[file.length-1] == folder){    //FOLDER
        return "folder";
    }else if(file.indexOf(pdf) !== -1){         //PDF
        return "pdf";
    }else if(file == ".."){
        return "back";
    }

    //UNKNOWN
    return "unknown";
    
}

function getFileIco(file){

    if(_is(file, image_types)){                 //IMAGE
        return "ico_image.png";
    }else if(_is(file,audio_types)){            //AUDIO
        return "ico_audio.png";
    }else if(_is(file,movie_types)){            //MOVIE
        return "ico_video.png";
    }else if(_is(file,doc_types)){              //DOCUMENT
        return "ico_document.png";
    }else if(_is(file,code_types)){             //CODE
        return "ico_codefile.png";
    }else if(_is(file,archive_types)){          //ARCHIVE
        return "ico_archive.png"
    }else if(file[file.length-1] == folder){    //FOLDER
        return "ico_folder.png";
    }else if(file.indexOf(pdf) !== -1){         //PDF
        return "ico_pdf.png";
    }else if(file == ".."){
        return "ico_back.png";
    }

    //UNKNOWN
    return "ico_unknownfile.png";
    
}

function _is(file, arr){
    for(i in arr)
        if(file.indexOf(arr[i]) !== -1)
            return true;
    return false;
};

var image_types = [
    ".jpg",".png",".bmp"
];
var audio_types = [
    ".wav",".mp3"
];
var pdf = ".pdf";
var movie_types = [
    ".mov",".mp4"
];
var doc_types = [
    ".txt",".doc",".docx"
];
var code_types = [
    ".cpp", ".js", ".h"
];
var archive_types = [
    ".zip",".rar",".tar.gz",".tar.xz",".7z"
];
var folder = "/";