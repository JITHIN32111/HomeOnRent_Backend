import { verify } from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1] 
  console.log(token);
  
  // Verify the JWT token
  if (token) {
    verify(token, 'super secret key', async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        const user = await findById(decodedToken.id);
        if (user) {
          res.json({ status: true, user: user });
        } else {
          res.json({ status: false });
        }
      }
      next();
    });
  } else {
    res.json({ status: false });
    next();
  }
};

export default verifyToken;
