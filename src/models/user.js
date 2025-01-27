const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 100 },
    lastName: { type: String },
    emailId: { type: String, lowercase: true, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: {
        type: String, validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWhh44XYTIGf3bDB6XHMysaZIL3uhsqTi8nA&s" },
    about: { type: String, default: "this is the default about the user!" },
    skills: { type: String }
}, {
    timestamps: true,
}
);

const User = mongoose.model("User", userSchema);

module.exports = User