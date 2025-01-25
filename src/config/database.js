const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connect("mongodb+srv://sachinkuldeep:jPjRAGLbgSXyi8hq@nodejs.e3ulc.mongodb.net/devTinder");
};

module.exports = connectDB