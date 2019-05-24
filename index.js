/*
POST request contains a JSON object
{
    "loc": <path>
}
Reply format
{
    "loc": <path>,
    "back": <path to return to>
    "contents":[
        {
            "name": <file name>,
            "path": <path>
            "isDir": <true|false>
        }
    ]
}

*/


const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const processing = require('./processing')

const port = 8080;
app = express()

let settings = JSON.parse(fs.readFileSync("settings.json"))

const DIR=settings.dirname;
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Check if a given directory is within the main defined directory or not
let inDir = (dircheck,dirmain) => !path.relative(path.normalize(dircheck), dirmain).startsWith('..')




//Get folder details

app.post('/files/ls',(req,res,next)=>{
    const location = processing.mergedir(req.body.loc,settings)
    const nloc = path.normalize(req.body.loc);
    //Make sure not escaping the given path; insecure
    if(inDir(settings.dirname,location)){
        fs.readdir(location,{withFileTypes:true},(err,files)=>{
            if(err){
                next(err)
            }
            else{
                res.json({
                    "loc": nloc ,
                    "back": inDir(settings.dirname, path.normalize(path.join(location,'..')) )?path.normalize(path.join(nloc,'..')):null,
                    "contents":processing.dirprocess(files,location,settings)
                })
            }
        })
    }
    else{
        res.status(404).json({"error":"Access denied","loc":'/'})
    }
    
    //next()
})

app.post('/files/ls',(res,rep,next)=>{

})


//Attempt to upload a file - Placeholder
app.put('/files/upload',(req,res)=>{
    console.log("Upload attempted")
    res.json({'error':500})
})

// Use jquery
app.use('/jquery', express.static( path.join(__dirname ,'node_modules','jquery','dist') ) )

// Use the statics
app.get( '/*', express.static( path.join(__dirname,'static') ) )


//All non-matched end up in this route
app.all('*',(req,res)=>{
    res.status(404).json({'error':404});

})

app.listen(port,()=>{
    console.log(`Listening : ${port}`)
})

app.use((err,req,res,next)=>{
    res.status(500).json({error:`${err}`})
})

module.exports = app;