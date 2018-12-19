const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema definition
const TodoSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('todo', TodoSchema);