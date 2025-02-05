const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//Add a user to database - Signup
authRouter.post("/signup", async (req, res) => {
    try {
        //validation of the data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating a new instance of the User model
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        await user.save();
        res.send("User added successfully..");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }

})

//User login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials!!");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // create a JWT token
            const token = await user.getJWT();

            // add the token to cookie and send back to the User
            res.cookie("token", token);
            res.send("Login successfull...");
        } else {
            throw new Error("Invalid credentials!!");
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

//User logout
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });

    res.send("Logout successful!!");
})

module.exports = authRouter;