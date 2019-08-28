const express = require('express');
const router = express.Router();
const services = require('../services');

router.get('/', services.getFiles);
router.get('/download/:filename', services.getFile);
router.get('/upload', services.uploadFile);

router.post('/upload', services.uploadFile);
router.post('/delete/:filename', services.deleteFile);

module.exports = router;