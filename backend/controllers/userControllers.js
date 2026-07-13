import TouristPlace from "../models/touristplaceModel.js";
import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";



// This controller is used to get the current user details.
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user ID found in request" });
        }

        // Fetch the user from the database using the user ID extracted from the token . Exclude the password field from the response for security reasons
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error in getCurrentUser", error: error.message });
    }
}


export const submitTouristPlace = async (req, res) => {
    try {
        const { 
            name, state, city, category, description, 
            bestTimeToVisit, entryFeesAndTimings, locationMapLink 
        } = req.body;

        const userId = req.userId;

        // 1. Validate required fields
        if (!name || !state || !city || !category || !description || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Cover image file is required' });
        }

        // 2. Upload image
        const coverImageUrl = await uploadOnCloudinary(req.file.path);
        if (!coverImageUrl) {
            return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }

        // 3. Create the place with 'pending' status and attach the user's ID
        const newPlace = await TouristPlace.create({
            name,
            state,
            city,
            category,
            description,
            bestTimeToVisit,
            entryFeesAndTimings,
            locationMapLink,
            coverImage: coverImageUrl,
            status: 'pending', // FORCED PENDING STATUS
            createdBy: userId // The ID comes from your isAuth middleware
        });

        res.status(201).json({
            message: 'Destination submitted successfully! It will appear on the site once approved by an admin.',
            place: newPlace
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This tourist place already exists in this state' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};