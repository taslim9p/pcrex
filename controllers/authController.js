import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";

import JWT from "jsonwebtoken";
import { sendVerifyMail } from "../config/sendMail.js";

export const registerController = async (req, res) => {
  try {
    const { uname, email, password, phone, address,address2, answer } = req.body;
    if (!uname) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please Login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      uname,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      address2,
    }).save();

    sendVerifyMail(email, user._id, uname);

    await res.status(201).send({
      success: true,
      message: "user Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

//login

export const loginController = async (req, res) => {
  try {
    console.log("controller");
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email OR Password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Email is not register:",
      });
    }
    if (user.isVerified === 1) {
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(404).send({
          success: false,
          message: "password is incorrect",
        });
      }
      //token
      const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.uname,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } else {
      sendVerifyMail(email, user._id, user.uname);
      return res.status(400).send({
        success: false,
        message: "Check your Email For Verification",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is reuired" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is reuired" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "newPassword  is reuired" });
    }

    //check credentials
    const user = await userModel.findOne({ email, answer });

    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "somthing went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send("protected route");
};

//update profile

// Update profile
// Update profile controller
export const updatedProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // Check if the password is provided and its length is at least 6 characters
    if (password && password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Hash the new password if provided
    const hashedPassword = password
      ? await hashPassword(password)
      : user.password;

    // Update the user data
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        uname: name || user.uname,
        password: hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//save orders
//save order
export const saveAllOrders = async (req, res) => {
  try {
    const { cart } = req.body;

    // Check if cart data is provided
    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create new order
    const order = new orderModel({
      products: cart,
      buyer: req.user._id,
      status: "Not Process",
    });

    console.log(order);
    // console.log(order.products);

    // Save the order to the database
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error while placing order:", error);
    res.status(500).json({
      success: false,
      message: "Error while placing order",
      error,
    });
  }
};

//All-orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 }); // Corrected sort value
    // console.log("orders");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }
    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
};

//get all userData

export const getAllUserData = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting user data",
      error,
    });
  }
};

//varify MAil

export const verifyMail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send({ error: "Token is required" });
    }

    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Check if the token is not expired
    });

    if (!user) {
      return res
        .status(400)
        .send({ error: "Verification token is invalid or has expired" });
    }

    // Verify the user
    user.isVerified = 1;
    user.verificationToken = undefined; // Remove the token
    user.verificationTokenExpires = undefined; // Remove the expiration time
    await user.save();

    res.render("emailVerified");
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
