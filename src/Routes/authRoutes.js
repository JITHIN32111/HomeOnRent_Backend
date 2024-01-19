import  express  from "express";
import * as user from '../controllers/authController.js'
const routes = express.Router();


routes.post("/register",user.signup)
routes.post("/login",user.login)
routes.get("/users/:id/verify/:token",user.emailVerification)
routes.get("/getAllSellers",user.getAllDetails)


export default routes;