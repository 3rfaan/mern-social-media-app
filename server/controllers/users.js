const User = require("../models/User");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userId, password, isAdmin } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Provide an user ID" });
  }

  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      await User.findByIdAndUpdate(id, {
        $set: req.body,
      });
      return res.status(200).json({ message: "Account has been updated" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can only update your own account" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.body;

  if (userId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id);

      return res.status(200).json({ message: "Account has been deleted" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can only delete your own account" });
  }
};

const getUser = async (req, res) => {
  const { userId, username } = req.query;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username });
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getFriends = async (req, res) => {
  const { userId } = req.params;

  let friendList = [];

  try {
    const user = await User.findById(userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );

    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    return res.status(200).json(friendList);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const followUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      if (!user.followers.includes(userId)) {
        await user.updateOne({
          $push: { followers: userId },
        });
        await currentUser.updateOne({
          $push: { following: id },
        });
        return res.status(200).json({ message: "User has been followed" });
      } else {
        return res
          .status(403)
          .json({ message: "You already follow this user" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "You can't follow yourself" });
  }
};

const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      if (user.followers.includes(userId)) {
        await user.updateOne({
          $pull: { followers: userId },
        });
        await currentUser.updateOne({
          $pull: { following: id },
        });
        return res.status(200).json({ message: "User has been unfollowed" });
      } else {
        res.status(403).json({ message: "You don't follow this user" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "You can't unfollow yourself" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
};
