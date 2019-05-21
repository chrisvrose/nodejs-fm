const paths = require('path')
module.exports.mergedir = (dirname,settings)=>{
    return paths.join(settings.dirname,dirname);
}

module.exports.dirprocess = (dirstream,settings)=>{
    if(!settings.showHidden){
        let fdirstream = dirstream.filter((ele)=>{
            return ele[0]!='.'
        })
        return fdirstream
    }
    else{
        return dirstream
    }
}

