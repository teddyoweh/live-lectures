// routes

const express = require('express');
const { createRecordingData, getRecordings } = require('../controllers/base.controllers');
const router = express.Router();


router.post('/create_recording', createRecordingData);
router.get('/get_recordings', getRecordings);




module.exports = router;