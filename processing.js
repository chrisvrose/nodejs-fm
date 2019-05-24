const path = require('path')
module.exports.mergedir = (dirname,settings)=>{
    return path.normalize(path.join(settings.dirname,dirname));
}

//produces the contents array
module.exports.dirprocess = (dirstream,location,settings)=>{
    let contents = []
    dirstream.forEach(element => {
        //console.log(element)
        if(!(element.name.startsWith('.')&&!settings.showHidden) )
        {
            contents.push({
                "name":element.name,
                "path":path.relative(settings.dirname,path.normalize(path.join(location,element.name))) ,
                "isDir": element.isDirectory()
            })
        }
    });
    return contents
}

