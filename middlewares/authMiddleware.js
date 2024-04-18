import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base
// Here whenever we get a request we next is executed and then response is sent
// req -> next -> res
export const requireSignIn = async (req, res, next) => {

    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode; // Decrypting
        next();

    } catch (error) {
        console.log(error);

    }
}

// Fuction to check if the user is admin or not, If user.role is equal 1 then user is admin
export const isAdmin = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user._id);

        // If user role is not equal to 1
        if (user.role !== 1) {

            return res.send({
                success: false,
                message: "Unauthorized Access"
            })
        }

        else {
            next(); // Authorize admin access
        }


    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in admin middleware",
            error
        })

    }
}