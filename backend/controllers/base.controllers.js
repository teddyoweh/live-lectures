const { Recording } = require("../models/recordings.models");

 


  async function createRecordingData(req, res) {

}

async function getRecordings(req,res) {
    const recordings = await Recording.find({});
    res.send(recordings);

}


module.exports = {
    getRecordings,createRecordingData
}