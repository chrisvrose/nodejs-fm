
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
    //$()
    //$(this).
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
            $('#files-table').prepend(`<tr class="files-row box-shadow-1-active"><td onclick="doUpdate($(this))" class="file-name file-isDir file-isBack" data-choice="${contents.back}">..</td></tr>`)
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




$(document).ready(()=>{
    populateContents();
    $('.file-download-button').click(()=>{
        console.log(currSel)
        $.ajax('/files/cat',{
            method:'post',
            data:currSel,
            xhrFields: {
                responseType: 'blob'
            },
            success:(msg)=>{
                //console.log(msg)
                $('.file-download-button').after(`<a id="down-temp" href="${window.URL.createObjectURL(msg)}" download="${currSel.name}"></a>`)
                document.getElementById('down-temp').click()
                $('#down-temp').remove();
            },
            error: err=>console.log(err)
        })
    })
})
