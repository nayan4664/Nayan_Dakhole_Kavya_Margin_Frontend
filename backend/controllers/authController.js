import Login from "../models/login.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    console.log("Email received:", email);

    const user = await Login.findOne({
      email: email.toLowerCase()
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};