const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        index: true
    },
    taskName: {
        type: String,
        required: true
    },
    storeage: {
        type: String,
        default: 'mongodb'
    }
}, { timestamps: true });

module.exports = mongoose.model(process.env.COLLECTION_NAME, taskSchema)