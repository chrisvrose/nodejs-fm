
let currDir = {'loc':'','contents':null};


function doUpdate(ele){
    console.log(ele.attr('data-choice'));
    if(ele.hasClass('file-isDir')){
        currDir.loc = currDir.loc+ "/"+ ele.attr('data-choice');
        populateContents();
    }
    //$()
    //$(this).
}

function updateContents(contents){
    //console.log(contents)
    $('#files-location').html(currDir.loc)
    if(contents===null) $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    else
    {
        $('#files-table').empty();
        contents.contents.forEach(element => {
            $('#files-table').append(`<tr class="files-row"><td onclick="doUpdate($(this))" class="file-name ${(element.type?'file-isDir':'file-isFile')}" data-choice="${element.name}">${element.name}</td><td class="file-handlers"></td></tr>`)
        });
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
