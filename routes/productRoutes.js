import express from "express";
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable"; // Package for parsing images

const router = express.Router();

// Routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// Get all products
router.get('/get-product', getProductController);

// Get single product
router.get('/get-product/:slug', getSingleProductController)

// Get product photo
router.get('/product-photo/:pid', productPhotoController)

// Delete product
router.delete('/delete-product/:pid', deleteProductController)

// Update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

// Filter product
router.post('/product-filters', productFiltersController);

// Product count
router.get('/product-count', productCountController);

// Product per page
router.get('/product-list/:page', productListController);

// Search Product
router.get('/search/:keyword', searchProductController);

// Similar Products
router.get('/related-product/:pid/:cid', relatedProductController);

// Category wise Products
router.get('/product-category/:slug', productCategoryController);

// Payments routes
// Token for verifying payment account of user
router.get('/braintree/token', braintreeTokenController);

// Payment
router.post('/braintree/payment', requireSignIn, braintreePaymentController);

export default router; 