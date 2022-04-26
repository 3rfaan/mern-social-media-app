const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Generate new password
    const salt = await bcrypt.genSalt();
    const hashedPw = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPw,
    });

    // Save user and respond
    const user = await newUser.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fill in all credentials" });
  }

  try {
    // Checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare hashed password with input password
    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw) {
      return res.status(400).json({ message: "Wrong password" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { register, login };
