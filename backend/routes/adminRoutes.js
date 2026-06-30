import express from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';
import {
    addState,
    addCity,
    addTouristPlace,
    getPendingPlaces,
    reviewPlaceSubmission
} from '../controllers/adminControllers.js';



const adminRouter = express.Router();

// ==========================================
// ADMIN ROUTES (Protected by isAuth & isAdmin)
// ==========================================

// Create Core Entities
adminRouter.post('/state', isAuth, isAdmin, addState);
adminRouter.post('/city', isAuth, isAdmin, addCity);
adminRouter.post('/place', isAuth, isAdmin, addTouristPlace);

// Moderation Engine
adminRouter.get('/places/pending', isAuth, isAdmin, getPendingPlaces);
adminRouter.put('/places/:placeId/review', isAuth, isAdmin, reviewPlaceSubmission);

export default adminRouter;