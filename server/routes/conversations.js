const router = require("express").Router();
const Conversation = require("../models/Conversation");

// New conversation
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get conversation
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Get Conversation includes two user IDs
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  const { firstUserId, secondUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
