import  express  from "express";
import * as property from '../controllers/propertyController.js'
const routes = express.Router();
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from "dotenv";


aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION

});

const s3 = new aws.S3();

export const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET,
      acl: "public-read",
      key: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname)
      }
    })
  })

routes.post("/listProperty",property.listProperty)
routes.get("/getProperty/:email",property.getPropertyDetails)
routes.get("/getAllProperty",property.getAllPropertyDetails)
routes.get("/changeStatus/:title",property.changePropertyStatus)
routes.get("/getPropertyEdit/:id",property.getPropertyForEdit)
routes.post("/deleteImg/:propertyId/:size",property.deleteImages)
routes.post("/pushImg",property.pushImages)
routes.post("/updateDetails",property.updateProperty)
routes.post("/deleteProperty/:id",property.deleteSellerProperty)
routes.get("/getAllPropertyToAdmin",property.getAllPropertyDetailsToAdmin)

routes.get("/getLatestApprovedProperties",property.getLatestProperties)
routes.get("/getDetailsUserSide",property.getDetailsForUserSide)
routes.post("/getFilterProperties",property.getFilterPropertiesForUser)
routes.get("/getIndividualProperty/:id",property.getIndividualPropertyDetails)

routes.post("/setScedule/:id/:formattedStartDate/:Id",property.setPropertySchedule)
// routes.post("/setUserScedule/:Id/:id",property.changeSceduleStatus)
routes.post("/setEnqueryDetails/:id",property.enqueryDetails)
routes.post("/payment",property.setPayment)
routes.get("/getSchedules/:id",property.getScheduleDetails)
routes.post("/checkSubscription/:email",property.checkSubscip)
routes.get("/checkOwnerInSubscription/:id",property.ownerSubscription)
routes.get("/getSubscription/:id",property.getMaxSubscription)
routes.post("/updateMaxCount/:id",property.updateMaxsubscription)
routes.get("/walletDetails",property.getWalletDetails)


routes.post('/upload',upload.array('files'),property.uploadProperty)
export default routes



