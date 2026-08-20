import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addReviewAndComment, deleteReviewAndComment, getAllStates, getFeaturedPlaces, getStateAndPlaces, getTouristPlaceBySlug, searchAndFilter } from '../controllers/exploreController.js';
import { upload } from '../middlewares/multer.js';

const exploreRouter = express.Router();

// Global Search and Filter Route (Place this above /state/:slug to prevent route conflicts)
exploreRouter.get('/search', isAuth, searchAndFilter);

// Get Featured Places for the homepage
exploreRouter.get('/featured', isAuth, getFeaturedPlaces); 

// Get all states for the homepage
exploreRouter.get('/get-all-states', isAuth, getAllStates);

// Get a specific state and all its tourist places by slug
exploreRouter.get('/state/:slug', isAuth, getStateAndPlaces);

// Get a specific tourist place by slug
exploreRouter.get('/place/:slug', isAuth, getTouristPlaceBySlug);

//Route to post a place image
exploreRouter.post('/place/:placeId/review', isAuth, upload.single('reviewImage'), addReviewAndComment);

//Route to delete a specific review
exploreRouter.delete('/place/:placeId/review/:reviewId', isAuth, deleteReviewAndComment);



export default exploreRouter;