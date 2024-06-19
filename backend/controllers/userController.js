import User from "../Models/userModel.js";
import bcrypt from "bcryptjs"
import { isEmailRgex, userDataValidation } from "../utils/validation.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const signupUser = async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const validate = userDataValidation({ name, email, username, password });
    if (validate) {
      return res.status(400).json({ error: validate });
    }
    const isEmailExist = await User.findOne({ email: email });
    if (isEmailExist) {
      return res.status(400).json({ error: "Email already exist" })
    }
    const isUsernameExist = await User.findOne({ username: username });
    if (isUsernameExist) {
      return res.status(400).json({ error: "Username already exist" });
    }
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

    const userObj = new User({
      name,
      email,
      username,
      password: hashPassword,
    })
    await userObj.save();
    if (userObj) {
      const token = generateTokenAndSetCookie(userObj._id, res);

      return res.status(200).json(token);
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error" })
  }
}

const loginUser = async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("All fields are required");

  try {
    let userDb;
    if (isEmailRgex({ email: loginId })) {
      userDb = await User.findOne({ email: loginId });
    } else {
      userDb = await User.findOne({ username: loginId });
    }

    if (!userDb) return res.status(400).json({ error: "User Not Found" });

    //passwod match
    const passwordMatch = await bcrypt.compare(password, userDb.password);
    if (!passwordMatch) return res.status(400).json({ error: "Password does not match" });
    console.log(userDb);
    const token = generateTokenAndSetCookie(userDb._id, res);

    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

export { logoutUser, signupUser, loginUser };
