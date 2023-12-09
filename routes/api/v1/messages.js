//require express
const express = require('express');
//create a new router
const router = express.Router();

//connect mongoose and make schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  id: Number,
  user: String,
  message: String,
}, {versionKey: false});

const Message = mongoose.model("Message", messageSchema);

// GET route for retrieving messages
router.get("/:id?", (req, res) => {
const id = req.params.id;
const user = req.query.user;

if (id) {
    //If there is an id get the message for this id from MongoDB
    Message.findById(id)
        .exec()
        .then((message) => {
            res.json({
                status: "success",
                message: `GETTING message with ID ${id}`,
                data: {
                    message,
                },
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Error getting message",
            });
        });
  } else if (user) {
    // If looking for a user, retrieve all messages for this user from MongoDB
    Message.find({ user: user })
        .exec()
        .then((messages) => {
            res.json({
                status: "success",
                message: `GETTING messages with username ${user}`,
                data: {
                    messages,
                },
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Error getting messages",
            });
        });
  } else {
    // if no id or user is asked for retrieve all messages from MongoDB
    Message.find({})
        .exec()
        .then((messages) => {
            res.json({
                status: "success",
                message: "GETTING all messages",
                data: {
                    messages,
                },
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                status: "error",
                message: "Error getting messages",
            });
        });
    }
});

router.post("/", (req, res) => {
    console.log("Received request body:", req.body);
    // Create a new message using the schema
    const message = new Message({
      user: req.body.message.user,
      message: req.body.message.message,
    });
  
    // Save the message
    message
      .save()
      .then((savedMessage) => {
        // Send back the new message object as JSON
        res.json({
          status: "success",
          message: `POSTING a new message for user ${message.user}`,
          data: {
            inputMessage: { user, message: text },
            savedMessage: savedMessage,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Error posting message",
        });
      });
  });

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Message.findByIdAndDelete(id)
    .exec()
    .then((deletedDoc) => {
      if (deletedDoc) {
        res.json({
          status: "success",
          message: `DELETING a message with id ${id}`,
          data: deletedDoc,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: `Message with id ${id} not found`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Error deleting the message",
      });
    });
});

module.exports = router;

module.exports = router;