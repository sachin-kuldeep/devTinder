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
                throw new Error("Gender is not valid!!!");
            }
        }
    },
    photoUrl: { type: String, default: "https://img.freepik.com/free-photo/portrait-handsome-attractive-stylish-bearded-man-brown_285396-4617.jpg?t=st=1740422137~exp=1740425737~hmac=7402b2ae22c753cf39830b3b4a44956faa943a46d76fd32624d411696b3178b2&w=1380",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL: " + value);
            }
        }
     },
    about: { type: String, default: "This is the default about the user!" },
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