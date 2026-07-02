import express from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';
import {
    addState,
    addCity,
    getPendingPlaces,
    reviewPlaceSubmission,
    addTouristPlace
} from '../controllers/adminControllers.js';
import { upload } from '../middlewares/multer.js';



const adminRouter = express.Router();

// ==========================================
// ADMIN ROUTES (Protected by isAuth & isAdmin)
// ==========================================

// Create Core Entities
adminRouter.post('/state', isAuth, isAdmin, upload.single('coverImage'), addState);
adminRouter.post('/city', isAuth, isAdmin, upload.single('coverImage'), addCity);
adminRouter.post('/place', isAuth, isAdmin, upload.single('coverImage'), addTouristPlace);

// Moderation Engine
adminRouter.get('/places/pending', isAuth, isAdmin, getPendingPlaces);
adminRouter.put('/places/:placeId/review', isAuth, isAdmin, reviewPlaceSubmission);

export default adminRouter;