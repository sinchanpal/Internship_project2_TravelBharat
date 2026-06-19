import express from "express"
import { Signin, Signout, SignUp } from "../controllers/authControllers.js";



const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/signin", Signin);
authRouter.get("/signout", Signout);



export default authRouter;