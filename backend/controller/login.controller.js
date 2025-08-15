import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userLogin = async (req, res) => {
  try {
    const { email, password,role } = req.body; // use "password"

    if (!email || !password || !role)
      return res.status(400).json({ message: "Input fields missing" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.status !== "approved")
      return res.status(403).json({ message: "User not approved by admin yet" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    if(user.role != role)
      return res.status(400).json({message:"Invalid request gateway"})
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log(user.role)
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default userLogin;
