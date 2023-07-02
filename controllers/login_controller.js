import nodemailer from "nodemailer";
import User from "../models/user_model.js";
import Verification from "../models/verification_model.js";
import { validateEmail } from "../helpers/validators.js";
import jwt from "jsonwebtoken";

const sendVerificationMail = (toStr) => {
  // Create 6 random digits
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);

  // Configure mailer transporter
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASS,
    },
  });

  var message = `Welcome to Götür Sepeti!\nYour verification code for the registering to Götür Sepeti is ${randomNumber}. Note that this code is a one-time valid code.`;
  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: toStr,
    subject: "Verification Code for Götür Sepeti!",
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification Email sent: " + info.response);
    }
  });

  return randomNumber;
};
export const login = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate email
    if (!validateEmail(email)) {
      return res.status(405).json({
        error: "Not a valid mail address for Bilkent University Students",
      });
    }

    const verificationNumber = sendVerificationMail(email);
    const existingUser = await User.findOne({ email });
    const verification = await Verification.findOne({ email });

    if (verification) {
      verification.verificationNumber = verificationNumber;
      verification.save();
    } else {
      await Verification.create({ email, verificationNumber });
    }

    if (existingUser) {
      // LOGIN
      res.status(200).json({
        message: "User exists, needs verification number for login",
        userExist: true,
      });
    } else {
      // SIGNUP
      res.status(200).json({
        message:
          "User doesn't exists, needs verification number and signup info for register",
        userExist: false,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const verify = async (req, res) => {
  const { email, verificationNumber } = req.body;
  try {
    const verification = await Verification.findOne({ email });
    if (verification.verificationNumber != verificationNumber) {
      return res.status(405).json({ error: "Incorrect verification number" });
    } else {
      const jwt_secret = process.env.JWT_SECRET || "test";
      const token = jwt.sign(
        { email, verificationNumber },
        jwt_secret, {expiresIn:  10 * 60 }
      );
      res.status(200).json({ message: "Verification is successful", token });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const completeLogin = async (req, res) => {
  const { email } = req.body;
  try {
    const verificationToken = req.headers.authorization.split(" ")[1];
    const jwt_secret = process.env.JWT_SECRET || "test";  
    let decodedData;
    try {
       decodedData = jwt.verify( verificationToken, jwt_secret);
    } catch (error) {
      console.log(error); 
      return res.status(405).json({error})
    }
    const verification = await Verification.findOne({ email: decodedData.email });
    if (verification.verificationNumber != decodedData.verificationNumber) {
      return res.status(405).json({ error: "Incorrect verification number" });
    }
      
    const existingUser = await User.findOne({ email });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      jwt_secret
    );
    res
      .status(200)
      .json({ message: "User logged in", user: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const completeSignUp = async (req, res) => {
  const {
    email,
    firstName,
    sexualOrientation,
    showOrientation,
    gender,
    showGender,
    birthDay,
    interests,
    lookingFor,
    interestedInSeeing,
  } = req.body;  

  try {

    const  verificationToken = req.headers.authorization.split(" ")[1];
    const jwt_secret = process.env.JWT_SECRET || "test";  

    let decodedData;
    try {
       decodedData = jwt.verify( verificationToken, jwt_secret);
    } catch (error) {
      console.log(error); 
      return res.status(405).json({error})
    }
    const verification = await Verification.findOne({ email: decodedData.email });
    if (verification.verificationNumber != decodedData.verificationNumber) {
      return res.status(405).json({ error: "Incorrect verification number" });
    }

    var bDay = new Date(birthDay);

    let createdUser;
    try {
        createdUser = await User.create({
        email,
        firstName,
        sexualOrientation,
        showOrientation,
        gender,
        showGender,
        birthDay: bDay,
        interests,
        lookingFor,
        interestedInSeeing,
      });

      
    } catch (error) {
      return res.status(404).json({ error: error });
    }

    const token = jwt.sign(
      { email: createdUser.email, id: createdUser._id },
      jwt_secret
    );

    console.log('====================================');
      console.log("SIGNED UP");
      console.log('====================================');
    return res
      .status(200)
      .json({ message: "User signed up", user: createdUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};
