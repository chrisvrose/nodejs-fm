
let currDir = {'loc':'','contents':null};


function doUpdate(ele){
    console.log(ele.attr('data-choice'));
    if(ele.hasClass('file-isDir')){
        currDir.loc = ele.attr('data-choice');
        populateContents();
    }
    //$()
    //$(this).
}

function updateContents(contents){
    console.log(contents)

    // Change top header contents
    $('#files-location').html(currDir.loc)

    // if empty, return null, this shouldnt execute if the server is responding properly but ok
    if(contents===null) {
        $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    }
    else
    {
        $('#files-table').empty();
        contents.contents.forEach(element => {
            $('#files-table').append(`<tr class="files-row"><td onclick="doUpdate($(this))" class="file-name ${(element.isDir?'file-isDir':'file-isFile')}" data-choice="${element.path}">${element.name}</td><td class="file-handlers"></td></tr>`)
        });
        if(contents.back!=null){
            $('#files-table').prepend(`<tr class="files-row"><td onclick="doUpdate($(this))" class="file-name file-isDir file-isBack" data-choice="${contents.back}">..</td><td class="file-handlers"></td></tr>`)
        }
    }
}

//set table details
function populateContents(){
    $.ajax('/files/ls',{
        method:'post',
        data: currDir,
        success:(msg)=>{
            updateContents(msg)
        }

    })
    return null;
}




$(document).ready(()=>{
    populateContents();
    //updateContents();
})
