// mongoose model for recordings

const mongoose = require('mongoose');


const recordingSchema = new mongoose.Schema({   
    title: {
    
    },
    description: {
 
    },
    recordingUrl: {
    
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

 const Recording = mongoose.model('Recording', recordingSchema);

    module.exports = {
        Recording
    }