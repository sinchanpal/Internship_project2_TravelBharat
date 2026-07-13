import express from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';
import {
    addState,
    addTouristPlace,
    updateState,
    updateTouristPlace,
    getPendingPlaces,
    approvePlace,
    rejectPlace
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

// Routes for the Contributor Approval Workflow
adminRouter.get('/pending-places', isAuth, isAdmin, getPendingPlaces);
adminRouter.put('/approve-place/:id', isAuth, isAdmin, approvePlace);
adminRouter.delete('/reject-place/:id', isAuth, isAdmin, rejectPlace);


export default adminRouter;