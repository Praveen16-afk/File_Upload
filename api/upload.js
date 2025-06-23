const multer = require('multer')
const path = require('path')
const {v4: uuidv4} = require('uuid')

const file_size = 5 * 1024 * 1024

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname)
        // const newName = `${Date.now()}-${Math.round(Math.random() + 1e9)}-${extension}`
        const newName = `${uuidv4()}${extension}`
        cb(null, newName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|webp/
    const isAllowed = allowedTypes.test(file.mimetype)
    if(isAllowed) {
        cb(null, true)
    }
    else {
        cb(new Error("Only JPEG, JPG, PNG, PDF and WEBP files allowed", false))
    }
}
module.exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: file_size
    },
    fileFilter: fileFilter
})