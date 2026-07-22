
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


// Fetch a single tourist place by its slug
export const getTouristPlaceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find the place and populate the state name so we can show it in the UI
        const place = await TouristPlace.findOne({ slug, status: 'approved' })
            .populate('state', 'name slug');

        if (!place) {
            return res.status(404).json({ message: 'Tourist place not found' });
        }

        res.status(200).json({
            success: true,
            place
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Unified Search and Filter Controller
export const searchAndFilter = async (req, res) => {
    try {
        const { q, category } = req.query;
        
        let matchedStates = [];
        let matchedPlaces = [];

        // Scenario 1: User clicked a "Browse by Interest" category button
        if (category) {
            matchedPlaces = await TouristPlace.find({ 
                category: { $in: [new RegExp(`^${category}$`, 'i')] }, // Exact case-insensitive match
                status: 'approved' 
            })
            .populate('state', 'name slug')
            .sort({ name: 1 });
            
            return res.status(200).json({
                success: true,
                states: [],
                places: matchedPlaces
            });
        }

        // Scenario 2: User typed in the Hero Search Bar
        if (q) {
            const searchRegex = new RegExp(q, 'i'); // Case-insensitive search pattern

            // Search States by name
            matchedStates = await State.find({ 
                name: { $regex: searchRegex } 
            }).sort({ name: 1 });

            // Search Tourist Places by name, city, or category
            matchedPlaces = await TouristPlace.find({
                $or: [
                    { name: { $regex: searchRegex } },
                    { city: { $regex: searchRegex } },
                    { category: { $regex: searchRegex } }
                ],
                status: 'approved'
            })
            .populate('state', 'name slug')
            .sort({ name: 1 });

            return res.status(200).json({
                success: true,
                states: matchedStates,
                places: matchedPlaces
            });
        }

        // Fallback if no query parameters are provided
        return res.status(200).json({ success: true, states: [], places: [] });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



