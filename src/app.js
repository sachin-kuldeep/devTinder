const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    //Creating a new instance of the User model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully..");
    } catch (err) {
        res.status(400).send("Error saving the user" + err.message);
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

app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        // const user = User.findOneAndDelete({_id: userId});
        res.send("User deleted successfully...");
    } catch (err) {
        res.status(400).send("something went wrong...");
    }

})
app.patch("/user", async (req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try {
        await User.findByIdAndUpdate({_id: userId}, data, {runValidators: true});
        
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

