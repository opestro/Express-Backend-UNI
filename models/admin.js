const mongoose = require('mongoose');
//Creatiion of the admin model 
const adminSchema = new mongoose.Schema({
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
});