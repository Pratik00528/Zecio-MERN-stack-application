import productModel from "../models/productModel.js"
import fs from "fs"
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js"
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';

dotenv.config();


// Payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields; // contains non-file fields
        const { photo } = req.files; // contains files

        // Validation using switch statement

        switch (true) {
            case !name:
                return res.send({ message: "Name is required!" })
            case !description:
                return res.send({ message: "Description is required!" })
            case !price:
                return res.send({ message: "Price is required!" })
            case !category:
                return res.send({ message: "Category is required!" })
            case !quantity:
                return res.send({ message: "Quantity is required!" })
            case !shipping:
                return res.send({ message: "Shipping is required!" })
            case !photo || photo.size > 100000:
                return res.send({ message: "Photo is required and it should be less than 1 MB" })
        }

        const product = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()
        res.status(200).send({
            success: true,
            message: "Product created successfully.",
            product
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in creating product.",
            error
        })

    }

}

export const getProductController = async (req, res) => {
    try {

        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: "Fetched all products successfully.",
            totalCount: products.length,
            products
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting products",
            error
        })

    }
}

export const getSingleProductController = async (req, res) => {
    try {

        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "Fetched the product successfully.",
            product
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in getting single product.",
            error
        })

    }
}

export const productPhotoController = async (req, res) => {
    try {

        const product = await productModel.findById(req.params.pid).select("photo")

        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }

    } catch (error) {

        console.log(error)
        res.send({
            success: false,
            message: "Error in getting product photo.",
            error
        })

    }
}

export const deleteProductController = async (req, res) => {
    try {

        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product deleted successfully.",
            product
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in deleting product.",
            error
        })

    }
}

export const updateProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields; // contains non-file fields
        const { photo } = req.files; // contains files

        // Validation using switch statement

        switch (true) {
            case !name:
                return res.send({ message: "Name is required!" })
            case !description:
                return res.send({ message: "Description is required!" })
            case !price:
                return res.send({ message: "Price is required!" })
            case !category:
                return res.send({ message: "Category is required!" })
            case !quantity:
                return res.send({ message: "Quantity is required!" })
            case !shipping:
                return res.send({ message: "Shipping is required!" })
            case !photo || photo.size > 100000:
                return res.send({ message: "Photo is required and it should be less than 1 MB" })
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()
        res.status(200).send({
            success: true,
            message: "Product updated successfully.",
            product
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in updating product.",
            error
        })

    }

}

export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body

        let args = {}

        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        const products = await productModel.find(args)

        res.status(200).send({
            success: true,
            message: "Filtered products fetched sucessfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error while filtering products",
            error
        })

    }
}

// Product count Controller
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            message: "Product count executed successfully",
            total
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting product count",
            error
        })

    }
}

// Product List based on page
export const productListController = async (req, res) => {
    try {

        const perPage = 3
        const page = req.params.page ? req.params.page : 1

        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting product list on page",
            error
        })

    }
}

// Search product Controller
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },

            ]
        })
            .select("-photo")

        res.json(result)

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in search product controller.",
            error
        })

    }
}

// Similar Products
export const relatedProductController = async (req, res) => {
    try {

        const { pid, cid } = req.params;

        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");

        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting similar products.",
            error
        })

    }
}

// Getting products by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate("category")

        res.status(200).send({
            success: true,
            message: "Categories wise products fetched successfully",
            category,
            products,
        })

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error while getting products by category",
            error
        })

    }

}

// Payment Gateway API
// Token
export const braintreeTokenController = async (req, res) => {

    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(response)

            }
        })

    } catch (error) {
        console.log(error)

    }

}

// Payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};