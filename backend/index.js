import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import exploreRouter from './routes/exploreRoutes.js';

dotenv.config();

const app = express();

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173"
    ], // Allow requests from this origin (your frontend)
    credentials: true // Allow cookies to be sent in cross-origin requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Adding urlencoded allows your server to handle form data, which some testing tools and frontend libraries use by default.
app.use(cookieParser());



// Routes
app.use("/api/auth", authRouter); // Use the authRouter for routes starting with /api/auth
app.use("/api/user", userRouter); // Use the userRouter for routes starting with /api/user
app.use("/api/admin", adminRouter); // Use the adminRouter for routes starting with /api/admin
app.use('/api/explore', exploreRouter); // Use the exploreRouter for routes starting with /api/explore


app.listen(PORT, () => {
    connectDB(); // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});