const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 100 },
    lastName: { type: String },
    emailId: { type: String, lowercase: true, required: true, unique: true, trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        }
     },
    password: { type: String, required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value);
            }
        }
     },
    age: { type: Number, min: 18 },
    gender: {
        type: String, validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWhh44XYTIGf3bDB6XHMysaZIL3uhsqTi8nA&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL: " + value);
            }
        }
     },
    about: { type: String, default: "this is the default about the user!" },
    skills: { type: Array }
}, {
    timestamps: true,
}
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Dev@Tinder@25", {expiresIn: "1d"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User