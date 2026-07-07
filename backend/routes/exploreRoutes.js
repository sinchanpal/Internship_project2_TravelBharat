import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { getAllStates, getStateAndPlaces, getTouristPlaceBySlug } from '../controllers/exploreController.js';

const exploreRouter = express.Router();

// Get all states for the homepage
exploreRouter.get('/get-all-states', isAuth, getAllStates);

// Get a specific state and all its tourist places by slug
exploreRouter.get('/state/:slug', isAuth, getStateAndPlaces);

// Get a specific tourist place by slug
exploreRouter.get('/place/:slug', isAuth, getTouristPlaceBySlug);

export default exploreRouter;