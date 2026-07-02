import City from "../models/cityModel.js";
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


export const getStateAndCities = async (req, res) => {
    try {
        const { slug } = req.params;

        // 1. Find the exact state using the slug from the URL
        const state = await State.findOne({ slug });

        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        // 2. Find all cities where the 'state' field matches this state's ObjectId
        const cities = await City.find({ state: state._id }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            state,
            cities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// backend/controllers/exploreController.js

export const getCitiesByStateId = async (req, res) => {
    try {
        const { stateId } = req.params;
        const cities = await City.find({ state: stateId }).sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            cities
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getCityAndPlaces = async (req, res) => {
    try {
        const { cityId } = req.params;

        // 1. Find the city using the ID from the URL
        const city = await City.findById(cityId).populate('state', 'name'); // Populating state name for the UI breadcrumbs
        
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        // 2. Find all approved tourist places where the 'city' field matches this city's ObjectId
        const places = await TouristPlace.find({ 
            city: city._id,
            status: 'approved' // Only show approved places
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            city,
            places
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};