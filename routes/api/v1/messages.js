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
    // create a new message
  const message = new Message();
  message.message = req.body.message.message;
  message.user = req.body.message.user;

    // save the message
    message
        .save()
        .then((savedMessage) => {
            // send back the new message object as JSON
            res.json({
                status: "success",
                message: `POSTING a new message for user ${message.user}`,
                data: {
                    inputMessage: req.body.message,
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

//put for a specific message id
router.put("/", (req, res) => {
    const id = req.params.id; // Use req.params.id to get the id from the query parameter
    const { message: newMessage, user: newUser } = req.body;
  
    Message.findById(id)
      .exec()
      .then((message) => {
        if (message) {
          message.message = newMessage || message.message;
          message.user = newUser || message.user;
  
          message
            .save()
            .then((updatedMessage) => {
              res.json({
                status: "success",
                message: `UPDATING message with id ${id}`,
                data: {
                  message: updatedMessage,
                },
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({
                status: "error",
                message: "Error updating message",
              });
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
          message: "Error updating message",
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