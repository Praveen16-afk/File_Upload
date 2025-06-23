const express = require("express")
const multer = require('multer')
const {upload} = require('./upload.js')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
const folderLocation = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(folderLocation))


app.post('/upload/file', upload.single("image"), (req, res) => {
    return res.json({message: "File uploaded", data: req.file})
})

app.post('/upload/files', upload.array("images"), (req, res) => {
    return res.json({message: "Files uploaded", data: req.files})
})

app.use((err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        switch(err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({message: "Error: File too Large! Maximum size 5MB"})
            default:
                return res.status(400).json({message: err.message})
        }
    }
    else {
        return res.status(400).json({message: err.message})
    }
    next()
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})