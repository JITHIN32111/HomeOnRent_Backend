import seller from "../models/seller.js";
import Token from "../models/token.js";
import sendMail from "../utils/sendEmail.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
import verifxyToken from "../middlewares/verifyToken.js";

dotenv.config();


// owner signup
// export const signup =
//   ("/register",
//   async (req, res) => {
// console.log("::::::::::");
// console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//     try {
//       const isExisting = await seller.findOne({ email: req.body.email });

//       if (isExisting) {
//         return res
//           .status(500)
//           .json({ msg: "Email is already taken by another user." });
//       }

//       const hashedPassword = await hash(req.body.password, 10);

//       const newUser = await seller.create({
//         ...req.body,
//         password: hashedPassword,
//       });
//       const token = await new Token({
//         userId: newUser._id,
//         token: randomBytes(32).toString("hex"),
//       }).save();

//       const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
//       await sendMail(newUser.email, "Verify Email", url);
//       const { password, ...others } = newUser._doc;
   

//       return res.status(201).json({
//         others,
//         message: "an email has sent to your account",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json(error);
//     }
//   });
export const signup =
 
  async (req, res) => {
console.log("::::::::::");
console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    try {
      const isExisting = await seller.findOne({ email: req.body.email });

      if (isExisting) {
        return res
          .status(500)
          .json({ msg: "Email is already taken by another user." });
      }

      const hashedPassword = await hash(req.body.password, 10);

      const newUser = await seller.create({
        ...req.body,
        password: hashedPassword,
      });
      const token = await new Token({
        userId: newUser._id,
        token: randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
      await sendMail(newUser.email, "Verify Email", url);
      const { password, ...others } = newUser._doc;
   

      return res.status(201).json({
        others,
        message: "an email has sent to your account",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

// ownerLogin
// export const login =
//   ("/login",
//   async (req, res) => {
//     try {
//       console.log(req.body);
//       const sellers = await seller.findOne({ email: req.body.email });

//       if (!sellers) {
//         return res.status(500).json("wrong credentials");
//       }

//       const comparePass = await compare(req.body.password, sellers.password);
//       if (!comparePass) {
//         return res.status(500).json("wrong credentials");
//       }

//       const token = jwt.sign({ id: sellers._id }, process.env.JWT_SECRET, {
//         expiresIn: "4h",
//       });

//       const { password, ...others } = sellers._doc;

//       return res.status(200).json({ others, token });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json(error);
//     }
//   });
export const login =
  
  async (req, res) => {
    try {
      console.log(req.body);
      const sellers = await seller.findOne({ email: req.body.email });

      if (!sellers) {
        return res.status(500).json("wrong credentials");
      }

      const comparePass = await compare(req.body.password, sellers.password);
      if (!comparePass) {
        return res.status(500).json("wrong credentials");
      }

      const token = jwt.sign({ id: sellers._id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });

      const { password, ...others } = sellers._doc;

      return res.status(200).json({ others, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

// ownerEmailVerification
export const emailVerification =
  ("/users/:id/verify/:token",
  async (req, res) => {
    try {
      const user = await seller.findOne({ _id: req.params.id });

      if (!user) return res.status(400).send({ message: "invalid link" });
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
     
      if (!token) return res.status(400).send({ message: "invalid link" });
    

      res.status(200).send({ message: "email verified successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "internal server error" });
    }
  });
 
  // getAllOwnerDetails
export const getAllDetails = async (req, res) => {
  try {
    const user = await seller.find({});

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "internal server error" });
  }
};
