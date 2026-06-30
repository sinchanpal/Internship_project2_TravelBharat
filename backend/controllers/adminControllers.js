import City from "../models/cityModel.js";
import State from "../models/stateModel.js";
import TouristPlace from "../models/touristplaceModel.js";

// ==========================================
//  STATE MANAGEMENT
// ==========================================

export const addState = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;

        if (!name || !description || !coverImage) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newState = await State.create({
            name,
            description,
            coverImage
        });

        res.status(201).json({
            message: 'State added successfully',
            state: newState
        });
    } catch (error) {
        // Handle Mongoose duplicate key error (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'State already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ==========================================
//  CITY MANAGEMENT
// ==========================================

export const addCity = async (req, res) => {
    try {
        const { name, state, description, coverImage } = req.body;

        if (!name || !state || !description || !coverImage) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newCity = await City.create({
            name,
            state, // This is the State ObjectId
            description,
            coverImage
        });

        res.status(201).json({
            message: 'City added successfully',
            city: newCity
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'City already exists in this state' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ==========================================
//  TOURIST PLACE MANAGEMENT (Admin Direct Add)
// ==========================================

export const addTouristPlace = async (req, res) => {
    try {
        // Because the admin is adding this, we automatically set status to 'approved'
        const placeData = { ...req.body, status: 'approved' };

        const newPlace = await TouristPlace.create(placeData);

        res.status(201).json({
            message: 'Tourist place added and approved successfully',
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