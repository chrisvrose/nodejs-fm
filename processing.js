const paths = require('path')
module.exports.mergedir = (dirname,settings)=>{
    return paths.normalize(paths.join(settings.dirname,dirname));
}

module.exports.dirprocess = (dirstream,settings)=>{
    dirstream.forEach(element => {
        element.type = element.isDirectory()
    });
    dirstream.push({'name':'..','type':true})
    //dirstream.contents.push({'name':'..','type':true})
    if(!settings.showHidden){
        let fdirstream = dirstream.filter((ele)=>{
            //ele.type=ele.isDirectory
            return ele.name[0]!='.'||ele.name=='..'
        })
        return fdirstream
    }
    else{
        return dirstream
    }
}

