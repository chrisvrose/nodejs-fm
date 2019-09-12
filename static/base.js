"use strict";
let currDir = {'loc':'','contents':null}
let currSel = {'loc':null,'name':null}


///Get Path at location
async function postLS(inputPath){
    return new Promise((resolve,reject)=>{
        $.ajax('/files/ls',{
            method:'post',
            data:{loc:inputPath},
            success:(msg)=>{
                resolve(msg);
            },
            error:(msg)=>{
                reject("E:"+msg)
            }
        })
    })
}


///Send request to move/rename files
async function postMV(oldLocation,newLocation){
    return new Promise((resolve,reject)=>{
        $.ajax({
            method:"post",
            data:{
                "loc":oldLocation,
                "nloc":newLocation
            },
            success:response=>{
                resolve(response)
            },
            error:err=>{
                reject(err)
            }
        })
    })
}


function doUpdate(ele,isDir=false){
    console.log(ele.attr('data-choice'))
    postLS(ele.attr('data-choice')).then(e=>{
        if(ele.hasClass('file-isDir')){
            currDir.loc=ele.attr('data-choice')
            postLS(currDir.loc);
        }
        if(!isDir){
            currSel.loc = ele.attr('data-choice')
            $('.nav-bottom-text').html( (currSel.name = ele.html()).substring(7) +"..." )
        }
    },
    err=>{
        console.log(`E:Something went wrong: ${JSON.stringify(err)}`)
    })
}

function updateContents(contentResponse){
    // Change top header contents
    $('#files-location').html(contentResponse.loc)

    // if empty, return null, this shouldnt execute if the server is responding properly but ok
    if(contentResponse===null) {
        $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    }else{
        $('#files-table').hide().empty();
        contentResponse.contents.forEach(element => {
            $('#files-table').append(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this),${element.isDir})" class="file-name ${(element.isDir?'file-isDir':'file-isFile')}" data-choice="${element.path}">${element.name}</td></tr>`)
        });
        if(contentResponse.back!==null){
            $('#files-table').prepend(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this),true)" class="file-name file-isDir file-isBack" data-choice="${contentResponse.back}">..</td></tr>`)
        }
        $('#files-table').fadeIn()
    }
}

// Closing the rename window
function closeRenameWindow(){
    $('.rename-window').fadeOut('fast')
    $("#cover").fadeOut('fast')
}
// Closing the upload window
function closeUploadWindow(){
    //
    $('.upload-window').fadeOut('fast')
    $("#cover").fadeOut('fast')
}


$(document).ready(()=>{
    postLS(".").then(e=>{updateContents(e)},e=>console.log(e))
    //postLS(currDir.loc);
    $('.file-download-button').click(()=>{
        console.log(currSel)
        if(currSel.loc===null){
            // This shouldn't happen but ok
            alert("Please select a file");
        }
        else{
            $('.file-download-button').after(`<a id="down-temp" href="/files/cat?loc=${currSel.loc}" download="${currSel.name}"></a>`)
            document.getElementById('down-temp').click()
            $('#down-temp').remove();
        }
    })
    $('.close-rename').click(()=>{
        closeRenameWindow();
    })
    $('.close-upload').click(()=>{
        closeUploadWindow();
    })
    $('.file-rename-button').click(()=>{
        if(currSel.loc===null){
            alert("No file selected")
        }
        else{
            $("#nloc-input").val(currSel.loc)
        }
        $('#cover').fadeIn('fast')
        $('.rename-window').fadeIn('fast')
    })
    $('.nav-bottom-button').click(()=>{
        $('#cover').fadeIn('fast')
        $('.upload-window').fadeIn('fast')
    })

    $('.done-rename').click(()=>{
        if(currSel.loc===null){
            alert("Please select a file");
        }
        else{
            postMV(currSel.loc,$("#nloc-input").val())
            .then(response=>{
                postLS(currDir.loc)
            })
            .then(response=>{
                alert("Moved")
            },
            err=>{
                alert("Not moved")
            })
            .catch(err=>{
                console.log("E:Something went wrong, very wrong")
            })
        }
    })

    $("#fileInput").change((e)=>{
        console.log(e.target.files)
        $("#fileLabel").html(e.target.files[0].name);
    })
    $(".done-upload").click(()=>{
        $("#fileLabel").html("Uploading")
        $("#upload-directory").val(currDir.loc)
        $.ajax("/files/upload",{
            method: 'post',
            processData:false,
            contentType:false,
            data:new FormData(document.getElementById('upload-form')),
            success:msg=>{
                alert("Uploaded")
                closeUploadWindow();
                postLS(currDir.loc);
            },
            error:msg=>alert("Error")
        })
    })
})