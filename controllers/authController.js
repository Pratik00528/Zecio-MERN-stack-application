import userModel from '../models/userModel.js'
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from "jsonwebtoken";
import orderModel from '../models/orderModel.js';

export const registerController = async (req, res) => {

    try {

        // Destructure the values of the user

        const { name, email, password, phone, address, answer } = req.body;

        // Validations -> Check if all the arguments are correct or not

        if (!name) {

            return res.send({ message: 'Name is required' })

        }
        if (!email) {

            return res.send({ message: 'Email is required' })

        }
        if (!password) {

            return res.send({ message: 'Password is required' })

        }
        if (!phone) {

            return res.send({ message: 'Phone number is required' })

        }
        if (!address) {

            return res.send({ message: 'Address is required' })

        }
        if (!answer) {
            console.log(answer)
            return res.send({ message: 'Answer is required' })

        }

        // Check if the user already exsists

        const existingUser = await userModel.findOne({ email }); // findOne is a Mongo DB function

        // If user already exsists
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User has already been registered, Please Login!",
            })
        }

        // Else if the user does not exist, we will register the user

        // First hash the password
        const hashedPassword = await hashPassword(password);

        // Now we will save the user in our database, we will use key-value pairs of Mongo-DB but as values have
        // same names as keys we directly write the keys except for password as we will save the hashedPassword in our
        // database instead of password for security purposes
        const user = await new userModel({ name, email, password: hashedPassword, phone, address, answer }).save()

        return res.status(201).send({
            success: true,
            message: "User Registered successfully!",
            user: user
        })



    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in Registration",
            error
        })



    }
}

// Login Route -> METHOD POST

export const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check if the email and password are valid
        if (!email || !password) {
            return res.status(200).send({
                success: false,
                message: "Invalid email or password!"

            })
        }

        // Check if user is registered or not
        const user = await userModel.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User is not registered!"
            })
        }

        const match = await comparePassword(password, user.password)

        // If passwords do not match
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid password!"
            })
        }

        // ELse the user should logged in. We do that here by using JWT token.
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).send({
            success: true,
            message: "Logged In successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: "Error in Login",
            error
        })

    }

}

// Forgot password controller

export const forgotPasswordController = async (req, res) => {

    try {
        const { email, answer, newPassword } = req.body

        if (!email) {
            return res.status(200).send({ message: "Email is required" })
        }

        if (!answer) {
            return res.status(200).send({ message: "Answer to the question is required" })
        }

        if (!newPassword) {
            return res.status(200).send({ message: "New Password is required" })
        }

        // Check if email and answer are correct we can reset the password

        const user = await userModel.findOne({ email, answer })

        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Invalid email or answer"
            })
        }

        // Else update password i.e. first hash it and then update this hashedPassword in our database

        const hashedPassword = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword })

        return res.status(200).send({
            success: true,
            message: "Password has been reset successfully."
        })

    } catch (error) {
        console.log(error)
        res.status(200).send({
            success: false,
            message: "Something went wrong with Forgot Password",
            error
        })

    }

}

// Test controller

export const testController = async (req, res) => {
    try {
        res.status(200).send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.status(200).send({ error });
    }
}

// Update Profile controller

export const updateProfileController = async (req, res) => {
    try {

        const { name, email, password, phone, address } = req.body

        const user = await userModel.findById(req.user._id)

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address,

        }, { new: true })

        res.status(200).send({
            success: true,
            message: "Updated user profile successfully",
            updatedUser
        })


    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in updating profile",
            error
        })

    }
}

// Display orders
export const getOrdersController = async (req, res) => {

    try {

        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");

        res.json(orders)

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in getting orders",
            error
        })

    }

}

// Get all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })

        res.json(orders);

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error while getting all orders",
            error,
        });
    }
};

// Update order status
export const orderStatusController = async (req, res) => {
    try {

        const { orderId } = req.params
        const { status } = req.body

        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })

        res.json(orders)

    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in updating order status",
            error
        })

    }
}
