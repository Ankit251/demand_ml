var admin = require("firebase-admin");
import path from "path";

// var serviceAccount = path.join(__dirname, "../../../service-key.json");

admin.initializeApp();
//   credential: admin.credential.cert(serviceAccount),
// });

exports.verifyFirebaseToken = (req, res, next) => {
  /**
   * This is middleware function verifies and validates the
   * FB Token in the request header. If FB Token key is valid then request
   * is allowed to process otherwise request fails with 403 error
   *
   * Input:
   *  req.header.authorization
   *  (POST - req.body)/(GET - req.query/req.params)
   */

  try {
    //console.log(req.cookies.token);
    //get auth header value from req
    const bearerheader = req.cookies.token;
    //check if bearer is undefined
    if (typeof bearerheader !== "undefined") {
      const bearertoken = req.cookies.token;
      const { getAuth } = require("firebase-admin/auth");
      // idToken comes from the client app
      getAuth()
        .verifyIdToken(bearertoken)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          console.log(uid);
          next();
        })
        .catch((error) => {
          console.log(error);
          return res.sendStatus(403);
        });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
  }
};
