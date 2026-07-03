import { uploadOnCloudinary } from "../config/cloudinary.js";
import State from "../models/stateModel.js";
import TouristPlace from "../models/touristplaceModel.js";

// ==========================================
//  STATE MANAGEMENT
// ==========================================
export const addState = async (req, res) => {
    try {
        // Notice we no longer destructure coverImage from req.body
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Please provide all text fields' });
        }

        // Check if Multer successfully attached the file to the request
        if (!req.file) {
            return res.status(400).json({ message: 'Cover image file is required' });
        }

        // Upload the local file to Cloudinary
        const coverImageUrl = await uploadOnCloudinary(req.file.path);

        //  Check if the upload was successful
        if (!coverImageUrl) {
            return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }

        // Create the state with the secure URL from Cloudinary
        const newState = await State.create({
            name,
            description,
            coverImage: coverImageUrl
        });

        res.status(201).json({
            message: 'State added successfully',
            state: newState
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'State already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



export const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // 1. Find the state we want to update
        let state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        // 2. Prepare the fields to update
        const updateData = { name, description };

        // 3. If the admin uploaded a new file, upload it and update the URL
        if (req.file) {
            const coverImageUrl = await uploadOnCloudinary(req.file.path);
            if (!coverImageUrl) {
                return res.status(500).json({ message: 'Failed to upload new image to Cloudinary' });
            }
            updateData.coverImage = coverImageUrl;
        }

        // 4. Update the state in the database
        const updatedState = await State.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true } // Returns the updated document
        );

        res.status(200).json({
            message: 'State updated successfully',
            state: updatedState
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A state with this name already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// ==========================================
//  TOURIST PLACE MANAGEMENT (Admin Direct Add)
// ==========================================

export const addTouristPlace = async (req, res) => {
    try {
        const { name, state, city, category, description } = req.body;

        if (!name || !state || !city || !category || !description) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Cover image file is required' });
        }

        // Upload to Cloudinary
        const coverImageUrl = await uploadOnCloudinary(req.file.path);

        if (!coverImageUrl) {
            return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }

        // Create the place in the database. 
        // We hardcode status to 'approved' since an admin is adding it.
        const newPlace = await TouristPlace.create({
            name,
            state,
            city,
            category,
            description,
            coverImage: coverImageUrl,
            status: 'approved'
        });

        res.status(201).json({
            message: 'Tourist place added successfully',
            place: newPlace
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This tourist place already exists in this city' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ==========================================
//  MODERATION ENGINE (User Submissions)
// ==========================================

// Fetch all places waiting for admin review
export const getPendingPlaces = async (req, res) => {
    try {
        // Populate allows us to see the actual State and City names instead of just their IDs
        const pendingPlaces = await TouristPlace.find({ status: 'pending' })
            .populate('state', 'name')
            .populate('city', 'name');

        res.status(200).json({
            count: pendingPlaces.length,
            places: pendingPlaces
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Approve or Reject a user submission
export const reviewPlaceSubmission = async (req, res) => {
    try {
        const { placeId } = req.params;
        const { action } = req.body; // Expects 'approve' or 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        const updatedPlace = await TouristPlace.findByIdAndUpdate(
            placeId,
            { status: newStatus },
            { new: true } // Returns the updated document
        );

        if (!updatedPlace) {
            return res.status(404).json({ message: 'Tourist place not found' });
        }

        res.status(200).json({
            message: `Tourist place successfully ${newStatus}`,
            place: updatedPlace
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};