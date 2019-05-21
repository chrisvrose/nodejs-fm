


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
    fs.readdir(DIR,(err,stream)=>{
        if(err){
            next(err)
        }
        else{

            res.json({"filename":`${DIR}`,"rootdir":processing.dirprocess(stream,settings)});
        }
    })
})


//Attempt to upload a file
app.put('/files/upload',(req,res)=>{
    console.log("Upload attempted")
})

//Get file details
app.post('/files/ls',(req,res)=>{
    console.log("Request attempted")
})


app.get( '/*', express.static( path.join(__dirname,'static') ) );

app.all('*',(req,res)=>{
    res.status(404).json({'error':404});

})

app.listen(port,()=>{
    console.log(`Listening : ${port}`)
})
