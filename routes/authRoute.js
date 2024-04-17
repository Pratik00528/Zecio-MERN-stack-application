import express from "express";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router object
const router = express.Router();

// Routing
// Register || METHOD POST
router.post('/register', registerController)

// Forgot Password || METHOD POS
router.post('/forgot-password', forgotPasswordController)

// Login || METHOD POST
router.post('/login', loginController)

// Test route || METHOD GET
// Here requireSignIn is the middleware
router.get('/test', requireSignIn, isAdmin, testController);

// Protected route to check if user is signed in or not || METHOD GET
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

// Protected route for admin || METHOD GET
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

// Update User profile
router.put('/profile', requireSignIn, updateProfileController);

// Get user orders
router.get('/orders', requireSignIn, getOrdersController);

// Get all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// Update order status
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;