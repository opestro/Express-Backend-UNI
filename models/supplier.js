const mongoose = require('mongoose');
//Creatiion of the supplier model 
const supplierSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    téléphone: {
        type: String,
        required: true,
    },
    
    registreDeCommerce: {
        type: String,
        default: ''
    },
    notes: {
        type: Number,
        default: 0
    },
    comments: {
        type: String,
        default: ''
    },
});
