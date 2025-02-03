const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");


//Connection Request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    const user = req.user;

    res.send(user.firstName + " sent a connection request!");
})

module.exports = requestRouter;