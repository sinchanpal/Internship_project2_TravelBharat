
import State from "../models/stateModel.js";
import TouristPlace from "../models/touristplaceModel.js";


// Fetch all states for the homepage
export const getAllStates = async (req, res) => {
    try {
        // We sort by name alphabetically (1) 
        const states = await State.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: states.length,
            states
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Fetch a single state by slug, along with all its Tourist Places
export const getStateAndPlaces = async (req, res) => {
    try {
        const { slug } = req.params;

        // 1. Find the exact state using the slug from the URL
        const state = await State.findOne({ slug });
        
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        // 2. Find all approved tourist places linked to this state's ObjectId
        // We sort them alphabetically by name
        const places = await TouristPlace.find({ 
            state: state._id,
            status: 'approved' 
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            state,
            places //  we are sending 'places' directly now!
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



