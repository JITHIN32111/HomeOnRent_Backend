import property from "../models/property.js";
import user from "../models/user.js";
import subscription from "../models/subscription.js";
import sendMail from "../utils/sendEmail.js";
import Stripe from "stripe";
import seller from "../models/seller.js";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(
process.env.STRIP_KEY
);

// uploadImage
export const uploadProperty = async (req, res) => {
  const mappedFiles = req.files.map((file) => {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      location: file.location,
    };
  });
  return res.status(201).json(mappedFiles);
};

// get  Properties of Owner
export const getPropertyDetails = async (req, res) => {
  try {
    const properties = await property.find({ email: req.params.email });

    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
  }
};

// create Property
export const listProperty = async (req, res) => {
  try {
    const propertyDetails = req.body.details;
    await new property({
      ...propertyDetails,
    }).save();
    return res.status(201).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// getAll property

export const getAllPropertyDetails = async (req, res) => {
  try {
    const properties = await property.find({});

    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
  }
};

// approveProperty
export const changePropertyStatus = async (req, res) => {
  try {
    await property.updateOne(
      { title: req.params.title },
      { $set: { status: "approved" } }
    );
    res.status(200).json({ message: "Status changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// getPropertyForEdit
export const getPropertyForEdit = async (req, res) => {
  try {
    const details = await property.findOne({ _id: req.params.id });
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// deleteImages
export const deleteImages = async (req, res) => {
  const { propertyId, size } = req.params;
  const imgSize = size;
  try {
    await property.updateOne(
      { _id: propertyId },
      { $pull: { img: { size: parseInt(imgSize) } } }
    );
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting image" });
  }
};

// addNewImages
export const pushImages = async (req, res) => {
  const { propertyId, img } = req.body;

  try {
    await property.updateOne(
      { _id: propertyId },
      { $push: { img: { $each: [...img] } } }
    );
    res.status(200).json({ message: "Images added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding images" });
  }
};

// updateProperty
export const updateProperty = async (req, res) => {
  const { details, propertyId } = req.body;

  parseInt(propertyId);
  try {
    await property.updateOne({ _id: propertyId }, { $set: details });
    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding images" });
  }
};

// deleteProperty
export const deleteSellerProperty = async (req, res) => {
  const id = req.params.id;
  parseInt(id);
  try {
    await property.deleteOne({ _id: id });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding images" });
  }
};

// getAllProperty
export const getAllPropertyDetailsToAdmin = async (req, res) => {
  try {
    const details = await property.find({});
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// get latest properties for userSide
export const getLatestProperties = async (req, res) => {
  try {
    const details = await property
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(8);

    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// get total cityCount
export const getDetailsForUserSide = async (req, res) => {
  try {
    const details = await property.find({});
    const cities = details.map((record) => record.location.city);
    // Step 2: Remove duplicate city names using a Set
    const uniqueCities = [...new Set(cities)];
    return res.status(200).json(uniqueCities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// filter properties
export const getFilterPropertiesForUser = async (req, res) => {
  console.log(req.body);
  const { location, propertyType, price } = req.body;
  
  try {
    // Retrieve properties from your database or data source
    const properties = await property.find();

    // Apply filters based on the received data
    const filteredProperties = properties.filter((property) => {
      // Apply location filter
      const isLocationMatch = property.location.city === location;

      // Apply property type filter
      const isPropertyTypeMatch = property.type === propertyType;

      // Apply price filter
      const [minPrice, maxPrice] = price.split("-");
      const propertyPrice = property.price;
      const isPriceMatch =
        propertyPrice >= minPrice && propertyPrice <= maxPrice;

      // Return true if all filters match, otherwise false
      return isLocationMatch && isPropertyTypeMatch && isPriceMatch;
    });

    return res.status(200).json(filteredProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving properties" });
  }
};

// getIndividualPropertyDetails
export const getIndividualPropertyDetails = async (req, res) => {
  try {
    const details = await property.findOne({ _id: req.params.id });
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status" });
  }
};

// set schedule
export const setPropertySchedule = async (req, res) => {
  try {
    const { id, formattedStartDate, Id } = req.params;

    // Find the property using the id from the property collection
    const prop = await property.findById(id);
    const userDetails = await user.findById(Id);
    const { email, phone } = userDetails;

    if (!prop) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Update the schedules field and increment the version
    prop.schedules.push({
      email,
      phone,
      sceduleDate: formattedStartDate,
      userId: Id,
    });
    prop.increment(); // Increment the version key

    // Save the updated property
    await prop.save();

    return res.status(200).json({ message: "Schedule added successfully" });
  } catch (error) {
    if (error.name === "VersionError") {
      // Handle the VersionError
      return res
        .status(409)
        .json({ message: "Document version mismatch. Please try again." });
    }
    console.error(error);
    return res.status(500).json({ message: "Error changing status" });
  }
};

// setEnquery
export const enqueryDetails = async (req, res) => {
  try {
    const details = req.body;
    const { email, phone, text } = details;
    const prop = await property.findById(req.params.id);
    await sendMail(
      prop.email,
      "Enquery Details",
      `Email Address:${email},Phone Number:${phone},Enquery:${text}`
    );

    if (!prop) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Update the schedules field and increment the version
    prop.enqueryDetails.push(details);
    prop.increment(); // Increment the version key

    // Save the updated property
    await prop.save();

    return res.status(200).json({ message: "Schedule added successfully" });
  } catch (error) {
    if (error.name === "VersionError") {
      // Handle the VersionError
      return res
        .status(409)
        .json({ message: "Document version mismatch. Please try again." });
    }
    console.error(error);
    return res.status(500).json({ message: "Error changing status" });
  }
};

// getScheduleDetails
export const getScheduleDetails = async (req, res) => {
  try {
    const properties = await property.find({
      _id: req.params.id,
      schedules: { $exists: true },
    });

    console.log(properties[0].schedules);
    return res.status(200).json(properties[0].schedules);
  } catch (error) {
    console.error(error);
  }
};

// payment
export const setPayment = async (req, res) => {
  let status, error;
  const { token, amount, sub } = req.body;
  const { _id: sellerId, sellername, email, phone, plan, price, max } = sub;
  try {
    // await stripe.paymentIntents.create({
    //   amount,
    //   description:"anything",
    //   currency: 'usd',
    //   customer:token.id
    // });
    console.log(max);
    stripe.customers
      .create({
        email: sub.email,
        source: token.id,
      })
      .then((customer) =>
        stripe.paymentIntents
          .create({
            amount,
            description: "anything",
            currency: "usd",
            customer: customer.id,
          })
          .then(async () => {
            if (plan == "Starter") {
              await seller.updateOne(
                { _id: sellerId },
                { $set: { maxProperties: 2 } }
              );
            }
            if (plan == "Medium") {
              console.log(":;;");
              await seller.updateOne(
                { _id: sellerId },
                { $set: { maxProperties: 5 } }
              );
            }
            if (plan == "Premium") {
              console.log(":;;");
              await seller.updateOne(
                { _id: sellerId },
                { $set: { maxProperties: 100 } }
              );
            }
            await subscription.create({
              sellerId,
              sellername,
              email,
              phone,
              price,
              plan,
            });
          })
          .catch((err) => {
            console.log(err);
          })
      );
    status = "success";
  } catch (error) {
    console.log(error);
    status = "Failure";
  }
  res.json({ error, status, plan });
};

// getPropertyLength for checkSubscription
export const checkSubscip = async (req, res) => {
  try {
    const properties = await property.find({ email: req.params.email });

    return res.status(200).json(properties.length);
  } catch (error) {
    console.error(error);
  }
};

export const ownerSubscription = async (req, res) => {
  try {
    console.log(req.params.id);
    const properties = await subscription.find({ sellerId: req.params.id });

    if (properties.length > 0) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getMaxSubscription = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await seller.find({ _id: req.params.id });
    const count = user[0].maxProperties;
    return res.json(count);
  } catch (error) {
    console.error(error);
  }
};
export const updateMaxsubscription = async (req, res) => {
  try {
    await seller.updateOne(
      { _id: req.params.id },
      { $set: { maxProperties: 2 } }
    );
    return res.json({ msg: "maxProperties changed into two" });
  } catch (error) {
    console.error(error);
  }
};

// getWalletDetails
export const getWalletDetails = async (req, res) => {
  try {
    const details = await subscription.find({});
    return res.json(details);
  } catch (error) {
    console.error(error);
  }
};
