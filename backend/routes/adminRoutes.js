import express from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';
import {
    addState,
    getPendingPlaces,
    reviewPlaceSubmission,
    addTouristPlace,
    updateState,
    updateTouristPlace
} from '../controllers/adminControllers.js';
import { upload } from '../middlewares/multer.js';



const adminRouter = express.Router();

// ==========================================
// ADMIN ROUTES (Protected by isAuth & isAdmin)
// ==========================================

// Create Core Entities
adminRouter.post('/state', isAuth, isAdmin, upload.single('coverImage'), addState);
adminRouter.post('/place', isAuth, isAdmin, upload.single('coverImage'), addTouristPlace);

// Update Core Entities
adminRouter.put('/state/:id', isAuth, isAdmin, upload.single('coverImage'), updateState);
adminRouter.put('/place/:id', isAuth, isAdmin, upload.single('coverImage'), updateTouristPlace);

// Moderation Engine
adminRouter.get('/places/pending', isAuth, isAdmin, getPendingPlaces);
adminRouter.put('/places/:placeId/review', isAuth, isAdmin, reviewPlaceSubmission);

export default adminRouter;