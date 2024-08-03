import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updatedProfileController,
  getOrdersController,
  saveAllOrders,
  getAllOrdersController,
  orderStatusController,
  cancelOrder,
  getAllUserData,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import Visit from "../models/visit.js";


const router = express.Router();

//routing

//register || method post
router.post("/register", registerController);

//login ||post
router.post("/signin", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//test route
router.get("/test", requireSignIn, isAdmin, testController);

//protected user-route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected admin-route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updatedProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//save orders
router.post("/addorders", requireSignIn, saveAllOrders);

//get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//order cancel
router.put("/cancel-order/:orderId", cancelOrder);


//get userdata for admin order
router.get('/userData/:user_id',requireSignIn,isAdmin,getAllUserData);

// Track visit
// Track visit
router.post('/track-visit', async (req, res) => {
  try {
    // Check if the visitor has already been tracked
    const existingVisit = await Visit.findOne({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (existingVisit) {
      return res.status(200).send('Visit already tracked');
    }

    // If not tracked, save the visit
    const newVisit = new Visit({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    await newVisit.save();
    res.status(200).send('Visit tracked');
  } catch (error) {
    res.status(500).send('Error tracking visit');
  }
});

// Total visitors
router.get('/total-visitors', requireSignIn, isAdmin, async (req, res) => {
  console.log("er");
  try {
    const totalVisits = await Visit.countDocuments({});
    res.status(200).json({ totalVisits });
  } catch (error) {
    res.status(500).send('Error retrieving visitor count');
  }
});
export default router;
