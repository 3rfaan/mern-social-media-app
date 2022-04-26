const router = require("express").Router();

const {
  createPost,
  updatePost,
  deletePost,
  likeDislikePost,
  getPost,
  getTimeline,
  getUserPosts,
} = require("../controllers/posts");

router.route("/").post(createPost);
router.route("/:id").get(getPost).put(updatePost).delete(deletePost);
router.route("/:id/like").put(likeDislikePost);
router.route("/timeline/:userId").get(getTimeline);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;
