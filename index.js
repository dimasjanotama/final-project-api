var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const port = 7777
const { authRouter } = require('./2.routers')



app.use(bodyParser())
app.use(cors())
app.use('/files', express.static('./uploads'))

app.use('/auth', authRouter) 

app.listen(port, console.log(`listenin' in port ${port}`));