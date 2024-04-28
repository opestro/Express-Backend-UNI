const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantité: {
    type: Number,
    required: true,
  },
 produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pproduit",
  },
});

exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
