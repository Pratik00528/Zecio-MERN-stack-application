import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create category controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.send({ message: "Name is required!" })
        }

        // Check if category is already present or not 

        const exisitingCategory = await categoryModel.findOne({ name })

        if (exisitingCategory) {
            return res.send({
                success: true,
                message: "Category already exists!"
            })
        }

        // Else category does not exist, we save this category to our database

        const category = await new categoryModel({ name, slug: slugify(name) }).save();

        return res.status(200).send({
            success: true,
            message: "New Category created!",
            category
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in creating category",
            error

        })

    }
}

// Update category controller
export const updateCategoryController = async (req, res) => {

    try {

        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })

        res.status(200).send({
            success: true,
            message: "Category updated successfully"
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in updating category",
            error
        })

    }

}

// Get All Categories
export const categoryController = async (req, res) => {

    try {

        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "Fetched all categories successfully.",
            category
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting all categories.",
            error
        })

    }

}

// Get single category

export const singleCategoryController = async (req, res) => {
    try {

        const { slug } = req.params; // Get slug from request parameters
        const category = await categoryModel.findOne({ slug })
        res.status(200).send({
            success: true,
            message: "Fetched single category successfully.",
            category
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in getting single category.",
            error
        })

    }
}

// Delete a single category

export const deleteCategoryController = async (req, res) => {
    try {

        const { id } = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Deleted category successfully.",
            category
        })

    } catch (error) {
        console.log(error);
        res.send({
            sucess: false,
            message: "Error in deleting a category",
            error
        })
    }
}