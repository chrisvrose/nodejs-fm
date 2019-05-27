
let currDir = {'loc':'','contents':null}
let currSel = {'loc':null,'name':null}

function doUpdate(ele,isDir=false){
    //console.log(ele.attr('data-choice'));
    if(ele.hasClass('file-isDir')){
        currDir.loc = ele.attr('data-choice')
        populateContents();
    }
    if(!isDir){
        currSel.loc = ele.attr('data-choice')
        $('.nav-bottom-text').html(currSel.name = ele.html())
        
    }
}

function updateContents(contents){
    //console.log(contents)

    // Change top header contents
    $('#files-location').html(contents.loc)

    // if empty, return null, this shouldnt execute if the server is responding properly but ok
    if(contents===null) {
        $('#files-table').append(`<tr><td>null</td><td class="file-handlers"></td></tr>`)
    }
    else
    {
        $('#files-table').hide().empty();
        contents.contents.forEach(element => {
            $('#files-table').append(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this),${element.isDir})" class="file-name ${(element.isDir?'file-isDir':'file-isFile')}" data-choice="${element.path}">${element.name}</td></tr>`)
        });
        if(contents.back!=null){
            $('#files-table').prepend(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this),true)" class="file-name file-isDir file-isBack" data-choice="${contents.back}">..</td></tr>`)
        }
        $('#files-table').fadeIn()
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


// Closing the rename window
function closeRenameWindow(){
    //
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
    populateContents();
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
        if(currSel.loc===nul){
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
            $.ajax("/files/mv",{
            method:"post",
            data:{
                loc:currSel.loc,
                nloc:$("#nloc-input").val()
            },
            success:(msg)=>{
                console.log(msg)
                populateContents()
                alert('Moved')
            },
            error:msg=>{
                console.log(msg)
                populateContents()
                alert("Could not move")
            }
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
                populateContents();
            },
            error:msg=>alert("Error")
        })
    })
})
