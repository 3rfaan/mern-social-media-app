const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);

    if (post.userId === userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json({ message: "The post has been updated" });
    } else {
      return res
        .status(403)
        .json({ message: "You can update only your own post" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);

    if (post.userId === userId) {
      await post.deleteOne();
      return res.status(200).json({ message: "The post has been deleted" });
    } else {
      return res
        .status(403)
        .json({ message: "You can delete only your own post" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const likeDislikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post.likes.includes(userId)) {
      await post.updateOne({
        $push: { likes: userId },
      });
      return res.status(200).json({ message: "The post has been liked" });
    } else {
      await post.updateOne({
        $pull: { likes: userId },
      });
      return res.status(200).json({ message: "The post has been disliked" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTimeline = async (req, res) => {
  const { userId } = req.params;

  try {
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    const timeline = userPosts.concat(...friendPosts);
    return res.status(200).json(timeline);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeDislikePost,
  getPost,
  getTimeline,
  getUserPosts,
};
