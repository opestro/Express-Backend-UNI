const mongoose = require("mongoose");

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ldivgk7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Set up default mongoose connection
const mongoDBURL = dbUrl; // Replace with your MongoDB URL
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection is successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully");
});
