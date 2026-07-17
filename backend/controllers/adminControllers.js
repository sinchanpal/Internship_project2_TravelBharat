import { uploadMultipleOnCloudinary, uploadOnCloudinary } from "../config/cloudinary.js";
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
        const {
            name, state, city, category, description,
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions 
        } = req.body;

        if (!name || !state || !city || !category || !description || !bestTimeToVisit || !entryFeesAndTimings || !locationMapLink) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // 1. Check for cover image in req.files (plural)
        if (!req.files || !req.files.coverImage) {
            return res.status(400).json({ message: 'Cover image file is required' });
        }

        // 2. Upload Cover Image
        const coverImageUrl = await uploadOnCloudinary(req.files.coverImage[0].path);
        if (!coverImageUrl) {
            return res.status(500).json({ message: 'Failed to upload cover image to Cloudinary' });
        }

        // 3. Upload Gallery Images (if any were provided)
        let galleryUrls = [];
        if (req.files.images && req.files.images.length > 0) {
            const imagePaths = req.files.images.map(file => file.path);
            galleryUrls = await uploadMultipleOnCloudinary(imagePaths);
        }

        // 4. Parse nearbyAttractions securely (Frontend will send it as a JSON string)
        let parsedAttractions = [];
        if (nearbyAttractions) {
            try { parsedAttractions = JSON.parse(nearbyAttractions); }
            catch (e) { parsedAttractions = [nearbyAttractions]; }
        }

        const newPlace = await TouristPlace.create({
            name, state, city, category, description,
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions: parsedAttractions,
            coverImage: coverImageUrl,
            images: galleryUrls,
            status: 'approved'
        });

        res.status(201).json({ message: 'Tourist place added successfully', place: newPlace });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'This tourist place already exists in this state' });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const updateTouristPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, state, city, category, description, 
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions 
        } = req.body;

        let place = await TouristPlace.findById(id);
        if (!place) return res.status(404).json({ message: 'Tourist place not found' });

        // Parse nearby attractions safely
        let parsedAttractions = place.nearbyAttractions; // Default to what is already in DB
        if (nearbyAttractions) {
            try { parsedAttractions = JSON.parse(nearbyAttractions); } 
            catch (e) { parsedAttractions = [nearbyAttractions]; }
        }

        const updateData = {
            name, state, city, category, description, 
            bestTimeToVisit, entryFeesAndTimings, locationMapLink,
            nearbyAttractions: parsedAttractions // <-- NEW
        };

        // If the admin uploaded a new cover image
        if (req.files && req.files.coverImage) {
            const coverImageUrl = await uploadOnCloudinary(req.files.coverImage[0].path);
            if (coverImageUrl) updateData.coverImage = coverImageUrl;
        }

        // If the admin uploaded new gallery images (this will replace the old gallery)
        if (req.files && req.files.images && req.files.images.length > 0) {
            const imagePaths = req.files.images.map(file => file.path);
            const galleryUrls = await uploadMultipleOnCloudinary(imagePaths);
            if (galleryUrls.length > 0) updateData.images = galleryUrls;
        }

        const updatedPlace = await TouristPlace.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json({ message: 'Tourist place updated successfully', place: updatedPlace });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'A place with this name already exists in this state' });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// ==========================================
//  MODERATION ENGINE (User Submissions)
// ==========================================

// Fetch all pending tourist places for the admin dashboard
export const getPendingPlaces = async (req, res) => {
    try {
        // We populate 'createdBy' to see who submitted it, and 'state' to get the state name
        const pendingPlaces = await TouristPlace.find({ status: 'pending' })
            .populate('createdBy', 'name email')
            .populate('state', 'name')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            success: true,
            count: pendingPlaces.length,
            places: pendingPlaces
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Approve a pending tourist place
export const approvePlace = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPlace = await TouristPlace.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        );

        if (!updatedPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Destination approved and is now live on the website!',
            place: updatedPlace
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Reject (delete) a pending tourist place
export const rejectPlace = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPlace = await TouristPlace.findByIdAndDelete(id);

        if (!deletedPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }

        // Note: In a fully production-scaled app, you might also want to write logic here 
        // to delete the associated image from Cloudinary to save storage space.

        res.status(200).json({
            success: true,
            message: 'Destination submission rejected and deleted.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};