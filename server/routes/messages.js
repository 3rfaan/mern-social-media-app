const router = require("express").Router();
const Message = require("../models/Message");

// Add
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({
      conversationId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
