require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname,"./clients/dist")));
app.use(cors());
app.use(express.json());


const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  fullname: String,
  pin: String,
  otp: String,
  verified: { type: Boolean, default: false }
});

const User = mongoose.model("User", UserSchema);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USERNAME, 
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: 'Test System',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`
  };

  return transporter.sendMail(mailOptions);
};

app.get("/",(req,res) => res.sendFile(path.join(__dirname, "./clients/dist/", "index.html")));

// Routes
app.post("/register", async (req, res) => {
  const { email, fullname, pin } = req.body;
  try {
    const hashedPin = await bcrypt.hash(pin, 10);
    const otp = generateOTP();

    const newUser = new User({
      email,
      fullname,
      pin: hashedPin,
      otp,
    });

    await newUser.save();

   
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "User registered, OTP sent to email" });
  } catch (error) {
  console.log(error);
    res.status(400).json({ error: "User registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, pin } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

   
    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
});


app.post("/verify", async (req, res) => {
  const { email, otp, pin } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch || otp !== user.otp) {
      return res.status(400).json({ error: "Invalid OTP or Pin" });
    }

 
    user.otp = null; 
    await user.save();

    res.status(200).json({ message: "OTP verified, login successful" });
  } catch (error) {
    res.status(400).json({ error: "OTP verification failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));

