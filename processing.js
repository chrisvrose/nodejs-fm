const paths = require('path')
module.exports.mergedir = (dirname,settings)=>{
    return paths.join(settings.dirname,dirname);
}

module.exports.dirprocess = (dirstream,settings)=>{
    dirstream.forEach(element => {
        element.type = element.isDirectory()
    });
    if(!settings.showHidden){
        let fdirstream = dirstream.filter((ele)=>{
            //ele.type=ele.isDirectory
            return ele.name[0]!='.'
        })
        return fdirstream
    }
    else{
        return dirstream
    }
}

