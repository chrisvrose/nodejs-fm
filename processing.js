module.exports.dirprocess = (dirstream,settings)=>{
    if(!settings.showHidden){
        let fdirstream = dirstream.filter((ele)=>{
            return ele[0]!='.'
        })
        return fdirstream
    }
    else return dirstream
}

