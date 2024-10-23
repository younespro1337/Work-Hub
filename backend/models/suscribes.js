const mongoose = require('mongoose');



const subsribersShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Subscribers = mongoose.model('Subscribers',subsribersShema);

module.exports = Subscribers;