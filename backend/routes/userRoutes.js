import express from "express"
import { getCurrentUser, submitTouristPlace } from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from '../middlewares/multer.js';



const userRouter = express.Router();

userRouter.get("/getCurrentUser", isAuth, getCurrentUser);
userRouter.post('/submit-place', isAuth, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), submitTouristPlace);



export default userRouter;