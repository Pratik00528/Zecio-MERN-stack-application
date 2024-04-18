import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

// routes

//Create Category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// Update Category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// Get All Categories
router.get('/get-category', categoryController);

// Get single category
router.get('/single-category/:slug', singleCategoryController);

// Delete a single category (only admin can do this, that is reason we add middlewares) 
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;