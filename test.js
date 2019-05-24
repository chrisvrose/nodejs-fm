const chai = require('chai')
const chai_http = require('chai-http')
const requests = require('requests')
const testScript = require('./index')


chai.use(chai_http)

let should = require('chai').should()

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
})