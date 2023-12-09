const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://wouter856:tanki2online@mongocluster.anbaifx.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "messages",
  }
);

const messageSchema = new mongoose.Schema(
  {
    user: String,
    text: String,
  },
  {
    collection: "messages",
  }
);

const Message = mongoose.model("Message", messageSchema);

// Body-parser middleware om JSON-berichten te verwerken
app.use(express.json());

// CORS toestaan
const cors = require("cors");
app.use(cors());

// GET-eindpunt for a message based on ID sent as a query parameter
app.get("/api/v1/messages", async (req, res) => {
  const username = req.query.user;
  const messageId = req.query.id;

  try {
    if (messageId) {
      // Handle requests with a message ID to retrieve a specific message
      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          status: "error",
          message: "Message not found",
        });
      }

      return res.json({
        status: "success",
        message: `GETTING message with ID ${messageId}`,
        data: {
          message,
        },
      });
    } else if (username) {
      // Handle requests with a username to retrieve messages by username
      const messages = await Message.find({ user: username });
      return res.json({
        status: "success",
        message: `GET messages with username ${username}`,
        data: {
          messages,
        },
      });
    } else {
      // Handle requests without ID or username to retrieve all messages
      const messages = await Message.find({});
      return res.json({
        status: "success",
        message: "GETTING all messages",
        data: {
          messages,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/messages", async (req, res) => {
  const { user, text } = req.body.message;

  const newMessage = new Message({
    user,
    text,
  });

  try {
    const message = await newMessage.save();
    res.json({
      status: "success",
      message: `POSTING a new message for user ${user}`,
      data: {
        message,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to save message",
    });
  }
});

app.put("/api/v1/messages/:id", async (req, res) => {
  const messageId = req.params.id;

  try {
    // Use the findByIdAndUpdate method to update the message in the database
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      req.body,
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        status: "error",
        message: "Message not found",
      });
    }

    res.json({
      status: "success",
      message: `UPDATING message with ID ${messageId}`,
      data: {
        message: updatedMessage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.delete("/api/v1/messages/:id", async (req, res) => {
  const messageId = req.params.id;

  try {
    // Use the findByIdAndDelete method to remove the message from the database
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({
        status: "error",
        message: "Message not found",
      });
    }

    res.json({
      status: "success",
      message: `DELETING message with ID ${messageId}`,
      data: {
        message: deletedMessage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
