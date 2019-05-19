


const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const port = 8080;
app = express()

//const DIR=JSON.parse()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

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
