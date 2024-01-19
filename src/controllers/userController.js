import user from "../models/user.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";
import property from "../models/property.js";
import dotenv from "dotenv";

dotenv.config();
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// userSignup
export const signup = async (req, res) => {
  try {
    const isExisting = await user.findOne({ email: req.body.email });

    if (isExisting) {
      return res
        .status(500)
        .json({ msg: "Email is already taken by another user." });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const newUser = await user.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = createToken(newUser._id);

    // Store the token in localStorage (within a browser environment)

    return res.status(201).json({
      newUser,
      msg: "sign up successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// userLogin
export const login = async (req, res) => {
  console.log(":::::::");
  try {
    const users = await user.findOne({ email: req.body.email });

    if (!users) {
      return res.status(500).json("wrong credentials");
    }

    const comparePass = await compare(req.body.password, users.password);
    if (!comparePass) {
      return res.status(500).json("wrong credentials");
    }

    const id = users._id;

    return res.status(200).json({ id });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// getUserDetails
export const userDetails = async (req, res) => {
  try {
    const details = await user.findOne({ _id: req.params.Id });
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// send owner details to user
export const sendOwnerDetails = async (req, res) => {
  try {
    const details = await user.findOne({ _id: req.params.Id });
    const data = await property.findOne({ _id: req.params.id });

    const { name, email, phone } = data;

    await sendMail(
      details.email,
      "Ownner Details",
      `Owner name:${name},Email Address:${email},Phone Number:${phone}`
    );
    data.ownerDetailsViewed.push(req.params.Id);
    data.increment(); // Increment the version key

    // Save the updated property
    await data.save();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};


// googleLogin
export const userGoogleLogin = async (req, res) => {
  try {
    const users = await user.findOne({ email: req.params.email });

    if (!users) {
      return res.status(500).json("wrong credentials");
    }

    const id = users._id;

    return res.status(200).json({ id });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
