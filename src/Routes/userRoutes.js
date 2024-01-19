import  express  from "express";
import * as user from '../controllers/userController.js'
import verifyToken from '../middlewares/verifyToken.js'
const routes = express.Router();


routes.post("/register",user.signup)
routes.post("/login",user.login)
routes.get("/getUserDetails/:Id",user.userDetails)
routes.get("/googleLogin/:email",user.userGoogleLogin)


routes.post("/sendSellerDetails/:Id/:id",user.sendOwnerDetails)


export default routes;