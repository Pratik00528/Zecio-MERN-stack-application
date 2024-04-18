import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectToDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure env
dotenv.config();

// Database config
connectToDB();

//Esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REST object
const app = express();

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))

// routes
app.use('/api/v1/auth', authRoutes); // Authorization Route
app.use('/api/v1/category', categoryRoutes); // Category Route
app.use('/api/v1/product', productRoutes); // Product Route

// REST API
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

// PORT -> for running our server
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.DEV_MODE;
// We store the sensitive information in .env file and when ever you add/update something in .env file, kill the server
// and run it again
// And remember do not semi-colon in .env file

// We have to listen -> run our app
app.listen(PORT, () => {
    console.log(`Server running ${DEV_MODE} mode on ${PORT}`.bgCyan);
})