const router = require("express").Router();

const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
} = require("../controllers/users");

router.route("/").get(getUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);
router.route("/friends/:userId").get(getFriends);

module.exports = router;
