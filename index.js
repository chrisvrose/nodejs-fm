


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

//Get the status of the folder and things related
app.get('/files',(req,res,next)=>{
    fs.readdir(DIR,{withFileTypes:true},(err,stream)=>{
        if(err){
            next(err)
        }
        else{
            //res.json(stream[0].isDirectory())
            res.json({"filename":`${DIR}`,"loc":processing.dirprocess(stream,settings)});
        }
    })
})


//Attempt to upload a file - Placeholder
app.put('/files/upload',(req,res)=>{
    console.log("Upload attempted")
    res.json({'error':500})
})


//Get folder details
app.post('/files/ls',(req,res,next)=>{
    const location = processing.mergedir(req.body.loc,settings)
    fs.readdir(location,{withFileTypes:true},(err,files)=>{
        if(err){
            next(err)
        }
        else{
            res.json({
                "location": location ,
                "contents":processing.dirprocess(files,settings)
            })
        }
    })
    
    //next()
})
//console.log(path.join(__dirname ,'node_modules','jquery','dist'))
app.use('/jquery', express.static( path.join(__dirname ,'node_modules','jquery','dist') ) )

app.get( '/*', express.static( path.join(__dirname,'static') ) )


//All non-matched end up in this route
app.all('*',(req,res)=>{
    res.status(404).json({'error':404});

})

app.listen(port,()=>{
    console.log(`Listening : ${port}`)
})
