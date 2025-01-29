const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

//Add a user to database
app.post("/signup", async (req, res) => {
    try {
        //validation of the data
        validateSignupData(req);

        const {firstName, lastName, emailId, password} = req.body;

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

//get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found.");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("something went wrong...");
    }
})

// feed API - GET - get all users data from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong...");
    }
})

//Delete a user from database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        // const user = User.findOneAndDelete({_id: userId});
        res.send("User deleted successfully...");
    } catch (err) {
        res.status(400).send("something went wrong...");
    }

})

//Update a user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k) );
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("skills can't be more than 10");
        }

        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true });

        res.send("User updated successfully...");
    } catch (err) {
        res.status(400).send("User not updated.." + err.message);
    }

})

connectDB()
    .then(() => {
        console.log("Database connected successfully...");
        app.listen(7777, () => {
            console.log('Server is successfully listening on port 7777...');
        });
    })
    .catch((err) => {
        console.error("Database connection failed!!");
    })

