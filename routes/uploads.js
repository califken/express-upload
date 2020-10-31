var express = require('express');
var router = express.Router();
const path = require('path'),
    FsPromises = require('fs').promises,
    Busboy = require('busboy'),
    multer = require('multer');

const MAXFILESIZE = 300000000;
const FILES_DIRECTORY = 'files';
const UPLOADS_DIRECTORY = 'uploads';

let upload = multer({
    dest: UPLOADS_DIRECTORY
})

router.post('/', upload.any(), async function(req, res, next) {
    let files = req.files;
    let uploadedfiles = [];
    const asyncRes = await Promise.all(files.map(async(file) => {
        try {
            await FsPromises.mkdir(`${FILES_DIRECTORY}/${file.filename}`);
            await FsPromises.rename(file.path, `${FILES_DIRECTORY}/${file.filename}/${file.originalname}`);
        } catch (error) {
            console.log(error);
        }
        uploadedfiles.push(file);
        return 'files/' + file.filename + "/" + file.originalname;
    }));
    res.json(uploadedfiles);
});

router.get('/download/:folder/:filename', function(req, res, next) {
    let folder = req.params.folder;
    let filename = req.params.filename;
    res.sendFile(path.resolve(`${FILES_DIRECTORY}/${folder}/${filename}`));
});

module.exports = router;