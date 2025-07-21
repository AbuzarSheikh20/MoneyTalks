import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register Function
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Dr Doc",
      text: `Welcome to the Dr Doc website. This is the website for your easiness where your id '${email}' has been created.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error); // For internal logging
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// Logout Function
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error); // For internal logging
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

// Send verify OTP
export const sendVerifyOTP = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userID);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified." });
    }
    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOTP = OTP;
    user.verifyOTPExpireAT = Date.now() + 3 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP.",
      text: `Your OTP is ${OTP}. Verify you account using this OTP and do not share this OTP with anyone..`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP has been sent on Email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { userID, OTP } = req.body;

  if (!userID || !OTP) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findById(userID);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== OTP) {
      return res.json({ success: false, message: "OTP invalid" });
    }

    if (user.verifyOTPExpireAT < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAT = 0;

    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// is Authenticated
export const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Send Reset OTP
export const sendResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.json({ success: false, message: "Email is required!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User not found!" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOTP = OTP;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP.",
      text: `Your OTP for resetting you password is ${OTP}. Use this OTP to proceed with resetting with your password and do not share this with anyone..`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP has been sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, OTP, newPassword } = req.body;

  if (!email || !OTP || !newPassword) {
    res.json({
      success: false,
      message: "Email, OTP is and New Password are required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "User not found." });
    }

    if (user.resetOTP === "" || user.resetOTP !== OTP) {
      res.json({ success: false, message: "OTP invalid" });
    }

    if (user.resetOTPExpireAt < Date.now()) {
      res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = "";
    user.resetOTPExpireAt = 0;

    await user.save();

    res.json({ success: false, message: "Password hs been reset succesfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
