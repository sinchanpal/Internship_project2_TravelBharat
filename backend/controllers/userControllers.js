import TouristPlace from "../models/touristplaceModel.js";
import User from "../models/userModel.js";
import { uploadMultipleOnCloudinary, uploadOnCloudinary } from "../config/cloudinary.js";



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
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions 
        } = req.body;

        const userId = req.userId;

        if (!name || !state || !city || !category || !description || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!req.files || !req.files.coverImage) {
            return res.status(400).json({ message: 'Cover image file is required' });
        }

        const coverImageUrl = await uploadOnCloudinary(req.files.coverImage[0].path);
        if (!coverImageUrl) {
            return res.status(500).json({ message: 'Failed to upload cover image to Cloudinary' });
        }

        // Upload Gallery Images
        let galleryUrls = [];
        if (req.files.images && req.files.images.length > 0) {
            const imagePaths = req.files.images.map(file => file.path);
            galleryUrls = await uploadMultipleOnCloudinary(imagePaths);
        }

        // Parse nearby attractions
        let parsedAttractions = [];
        if (nearbyAttractions) {
            try { parsedAttractions = JSON.parse(nearbyAttractions); } 
            catch (e) { parsedAttractions = [nearbyAttractions]; }
        }

        const newPlace = await TouristPlace.create({
            name, state, city, category, description,
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions: parsedAttractions, // <-- NEW
            coverImage: coverImageUrl,
            images: galleryUrls, // <-- NEW
            status: 'pending',
            createdBy: userId 
        });

        res.status(201).json({
            message: 'Destination submitted successfully! It will appear on the site once approved by an admin.',
            place: newPlace
        });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'This tourist place already exists in this state' });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};