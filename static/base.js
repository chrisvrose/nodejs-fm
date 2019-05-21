
let currDir = {'loc':'','contents':null};

function updateContents(contents){
    console.log(contents)
    $('#files-location').html(contents.loc)
    if(contents===null) $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    else
    contents.contents.forEach(element => {
        $('#files-table').append(`<tr><td class="file-name ${(element.type?'file-isDir':'file-isFile')}">${element.name}</td><td class="file-handlers"></td></tr>`)
    });
}

//set table details
function populateContents(){
    $.ajax('/files/ls'+currDir.loc,{
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
