import User from "../model/User.model.js";
import crypto from "crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  // get data
  //validate
  // check if user already exists
  // create a user in database
  //create a verification token
  // save token in database
  // send token as email to user
  // send success status to user

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  console.log(email);
  console.log(name);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }



    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);

console.log("yaha fail nhi huwa hu");
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

console.log("yaha fail nhi huwa hu");
    //crypto is use for creating random string
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();



    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
  console.log("REGISTER ERROR FULL:", error);
  console.log("REGISTER ERROR MESSAGE:", error.message);
  console.log("REGISTER ERROR STACK:", error.stack);

  return res.status(500).json({
    message: error.message,
  });
}

};






const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //jwt token

    const token = jwt.sign(
      { id: user._id, role: user.role },

      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
     res.status(400).json({
      message: "User not registered ",
      error,
      success: false,
     }
     )
  }
};

console.log("Am alright till login");


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in get me", error);
  }
};

console.log("am alright till getMe")

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {}
};






export { registerUser ,login,getMe,logoutUser};