const chai = require('chai')
const chai_http = require('chai-http')
const fs = require('fs')


chai.use(chai_http)
let should = require('chai').should()

//TESTING ONLY COVERS LS and CAT
// TODO: /file/mv
// TODO: /file/upload




describe('Readup and start server',()=>{
    it('Have a settings.json',done=>{
        fs.existsSync("settings.json").should.be.true;
        done()
    })
    it('Read up required files',done=>{
        let settings = JSON.parse(fs.readFileSync("settings.json"))
        should.exist(settings.dirname)
        done()
    })
})

const testScript = require('./index')



describe('Page Status',()=>{
    it('Get /',(done)=>{
        chai.request(testScript).get('/').end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('POST /files/ls the home page',(done)=>{
        chai.request(testScript).post('/files/ls').send({'loc':'/'}).end((err,res)=>{
            res.should.have.status(200)
            res.body.should.have.property('loc').eql('.')
            res.body.should.have.property('back').eql(null)
            //TODO: MAKE SURE JSON FILE
            done()
        })
    })
    it('POST ../ and fetch error',done=>{
        chai.request(testScript).post('/files/ls').send({'loc':'../'}).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('POST for some file that does not exist',done=>{
        chai.request(testScript).post('/files/ls').send({'loc':'\\'}).end((err,res)=>{
            res.should.have.status(500)
            done()
        })
    })
    it('POST and try to download a directory',done=>{
        chai.request(testScript).get('/files/cat').query({loc:'.'}).end((err,res)=>{
            res.should.have.status(500)
            done()
        })
    })
})