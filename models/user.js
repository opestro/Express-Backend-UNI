const mongoose = require("mongoose");
//Creatiion of the user model
const userSchema = new mongoose.Schema({
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
  rue: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  appartement: {
    type: String,
    default: "",
  },
  codePostal: {
    type: String,
    default: "",
  },
  ville: {
    type: String,
    default: "",
  },
  codeMédical: {
    type: String,
    default: "",
  },
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
