import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { status } from "http-status";
import jwt from "jsonwebtoken";
import Meeting from "../models/MeetingModel.js";

const saltRounds = 10;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    if (!name || !email || !password) {
      return res.json({ success: false, message: "fill the details" });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);

    const data = new User({
      name,
      email,
      password: hashPassword,
    });

    const userData = await data.save();
    
    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);
    userData.token = token;
    await userData.save();

    return res
      .status(status.CREATED)
      .json({ success: true, message: userData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "fill the details" });
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      return res
        .status(status.NOT_FOUND)
        .json({ success: false, message: "User Not found" });
    }

    const match = await bcrypt.compare(password, userData.password);

    if (!match) {
      return res.json({
        success: false,
        message: "email or password is incorrect",
      });
    }

    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);
    userData.token = token;
    await userData.save();

    return res.status(status.OK).json({ success: true, message: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error });
  }
};

export const getUserHistory = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    const meetings = await Meeting.find({ user_id: user.name });
    res.json({ success: true, message: meetings });
  } catch (error) {
    res.json({ success: false, message: error });
    console.log(error);
  }
};

export const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });

    const newMeeting = new Meeting({
      user_id: user.name,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(status.CREATED).json({ success: true, message: newMeeting });
  } catch (error) {
    res.json({ success: false, message: error });
  }
};
