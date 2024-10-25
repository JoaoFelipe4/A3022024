const express = require('express')
const AWS = require('aws-sdk')
const multer = require('multer')
const upload = muletr({dest: 'uploads/'})
const app = express()
const port = 3000

const s3 = new AWS.S3();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', upload.single('image'), (req,res) => {
    s3.putObject(req.file)
    res.send('success!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})