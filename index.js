
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const processing = require('./processing')
const busboy = require('connect-busboy')
const morgan = require('morgan');
// Import settings
const settings = JSON.parse(fs.readFileSync("settings.json"))

app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(busboy())

///Make the directory if it doesnt exist
if(!fs.existsSync(settings.dirname)){
    fs.mkdirSync(settings.dirname)
}

// Download file
//loc
app.get('/files/cat',(req,res,next)=>{
    //console.log(req.body)
    const location = processing.mergedir(req.query.loc,settings)
    //const nloc = path.normalize(req.body.loc);
    const nloc = path.normalize(path.relative(settings.dirname,location))
    if(processing.inDir(settings.dirname,location)){
        res.download(location,err=>{if(err) next(err)} )
    }
})

//Get folder details
//loc
app.post('/files/ls',(req,res,next)=>{
    const location = processing.mergedir(req.body.loc,settings)
    // nloc - Path to show the user
    const nloc = path.normalize(path.relative(settings.dirname,location))
    //console.log([loc,nloc])
    //Make sure not escaping the given path; insecure
    if(processing.inDir(settings.dirname,location)){
        fs.readdir(location,{withFileTypes:true},(err,files)=>{
            if(err){
                next(err)
            }
            else{
                res.json({
                    "loc": nloc ,
                    "back": processing.inDir(settings.dirname, path.normalize(path.join(location,'..')) )?path.normalize(path.join(nloc,'..')):null,
                    "contents":processing.dirprocess(files,location,settings)
                })
            }
        })
    }
    else{
        res.status(404).json({"error":"Access denied","loc":'/'})
    }
})

// Rename / move files
//loc,nloc
app.post('/files/mv',(req,res,next)=>{
    //console.log(req.body)
    const loc1 = processing.mergedir(req.body.loc,settings)
    if(path.normalize(loc1).startsWith('.')) {
        next(new Error("Cannot find dir"))
    }
    const loc2 = processing.mergedir(req.body.nloc,settings)
    //log([loc1,loc2])
    if(processing.inDir(settings.dirname,loc1)&&processing.inDir(settings.dirname,loc2)){
        fs.rename(loc1,loc2,err=>{
            if(err){
                next(err)
            }
            else{
                res.json({'loc':req.body.nloc})
            }
        })
    }
})

// Attempt to upload a file
// Note : loc takes in directory, and not file
app.post('/files/upload',(req,res,next)=>{
    //console.log("Upload attempted")
    let oloc=null
    let nloc={path:null,fn:null}
    req.pipe(req.busboy)

    req.busboy.on('field',(fieldname,val,fieldtrunc,valtruc,encoding,mimetype)=>{
        if(fieldname=='loc') nloc.path = val
    })
    req.busboy.on("file",(fieldname, file, filename, encoding, mimetype)=>{
        oloc = processing.getTmpDir(filename)
        nloc.fn = path.basename(filename)
        //console.log(oloc)
        file.pipe(fs.createWriteStream(oloc))
    })
    req.busboy.on('finish',()=>{
        try{
            // Read 
            if(nloc.path===null) {
                throw Error("No path defined")
            }
            const loc = path.join(settings.dirname,nloc.path.trim(),nloc.fn)
            //Make sure uploadable location is in required directory
            if(processing.inDir(settings.dirname,loc)){
                fs.createReadStream(oloc).pipe(fs.createWriteStream(loc))
                res.json({"loc":nloc.path})
            }
            else{
                throw new Error("Not in directory")
            }
        }
        catch(e){
            // Enable to watch errors
            //console.log(e)
            next(e)
        }
    })
})


// Use font-awesome
app.use('/fa',express.static(path.join(__dirname,'node_modules','@fortawesome','fontawesome-free')))

// Use jquery
app.use('/jquery', express.static( path.join(__dirname ,'node_modules','jquery','dist') ) )

// Use the statics
app.get( '/*', express.static( path.join(__dirname,'static') ) )


//All non-matched end up in this route
app.all('*',(req,res)=>{
    res.status(404).json({'error':404});

})

app.listen(settings.port,()=>{
    console.log(`Listening : ${settings.port}`)
})

app.use((err,req,res,next)=>{
    console.log("E:"+JSON.stringify(err))
    res.status(500).json({error:`Internal error.Try again.`})
})

module.exports = app;