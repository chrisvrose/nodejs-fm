"use strict";
let currDir = {'loc':'','contents':null}
let currSel = {'loc':null,'name':null}

function makeLSRequest(location){
    return {
        loc: location
    }
}

function makeMVRequest(location,newLocation){
    return {
        loc: location,
        nloc: newLocation
    }
}



///Get Path at location
async function postLS(inputPath){
    return new Promise((resolve,reject)=>{
        $.ajax('/files/ls',{
            method:'post',
            data: makeLSRequest(inputPath),
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
        $.ajax('/files/mv',{
            method:'post',
            data: makeMVRequest(oldLocation,newLocation),
            success:response=>{
                resolve(response)
            },
            error:err=>{
                reject(err)
            }
        })
    })
}


///Call for onclick of elements
function doUpdate(ele,isDir=false){
    if(!isDir){
        currSel.loc = ele.attr('data-choice')
        $('.nav-bottom-text').html( (currSel.name = ele.html()) )
    }else{
        ///Check if navigable directory
        postLS(ele.attr('data-choice')).then(e=>{
            if(ele.hasClass('file-isDir')){
                ///Set as current directory
                currDir.loc=ele.attr('data-choice')
                updateContents(e)
            }
            
        },
        err=>{
            console.log(`E:Something went wrong: ${JSON.stringify(err)}`)
        })
    }
    
}


///Populate contents
function updateContents(contentResponse){
    ///Change top header contents
    $('#files-location').html(contentResponse.loc)

    // if empty, return null, this shouldnt execute if the server is responding properly but ok
    if(contentResponse===null) {
        $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    }else{
        $('#files-table').hide().empty();
        if(contentResponse.contents.length===0){
            $('#files-table').append(`<tr class="files-row"><td>...No files...</td></tr>`);
        }else{
            contentResponse.contents.forEach(element => {
                $('#files-table').append(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this),${element.isDir})" class="file-name ${(element.isDir?'file-isDir':'file-isFile')}" data-choice="${element.path}">${element.name}</td></tr>`)
            });
        }
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


$(()=>{
    postLS(".")
        .then(e=>{updateContents(e)})
        .catch(err=>console.log(err))
    //postLS(currDir.loc);
    $('.file-download-button').on('click',()=>{
        console.log(currSel)
        if(currSel.loc===null){
            // This shouldn't happen but ok
            alert("Please select a file");
        }
        else{
            $('.file-download-button').after(`<a id="down-temp" href="/files/cat?loc=${currSel.loc}" download="${currSel.name}"></a>`)
            document.getElementById('down-temp').on('click',)
            $('#down-temp').remove();
        }
    })
    $('.close-rename').on('click',()=>{
        closeRenameWindow();
    })
    $('.close-upload').on('click',()=>{
        closeUploadWindow();
    })
    $('.file-rename-button').on('click',()=>{
        if(currSel.loc===null){
            alert("No file selected")
        }
        else{
            $("#nloc-input").val(currSel.loc)
            $('#cover').fadeIn('fast')
            $('.rename-window').fadeIn('fast')
        }
    })
    $('.nav-bottom-button').on('click',()=>{
        $('#cover').fadeIn('fast')
        $('.upload-window').fadeIn('fast')
    })

    $('.done-rename').on('click',()=>{
        if(currSel.loc===null){
            alert("Please select a file");
        }
        else{
            postMV(currSel.loc,$("#nloc-input").val())
            .then(response=>{
                postLS(currDir.loc).then(e=>{updateContents(e)})
                .catch(err=>console.log(err))
            })
            .then(response=>{
                alert("Moved")
            },
            err=>{
                console.log('E',err);
                alert("Not moved")
            })
            .catch(err=>{
                console.log("E:Something went wrong, very wrong")
            })
        }
    })

    $("#fileInput").on('change',(e)=>{
        console.log(e.target.files)
        $("#fileLabel").html(e.target.files[0].name);
    })
    $(".done-upload").on('click',()=>{
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
                postLS(currDir.loc).then(e=>{updateContents(e)})
                .catch(err=>console.log(err));
            },
            
            error:msg=>alert("Error")
        }).progress(function (){
            console.log('prog');
            // $("#fileLabel").html("Uploading",progress)
        })
    })
})