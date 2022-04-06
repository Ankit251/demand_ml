var jwt = require("jsonwebtoken");

exports.verifyJwtToken = (req, res, next) => {
  /**
   * This is middleware function verifies and validates the
   * JWT in the request header. If JWT key is valid then request
   * is allowed to process otherwise request fails with 403 error
   *
   * Input:
   *  req.header.authorization
   *  (POST - req.body)/(GET - req.query/req.params)
   */

  try {
    console.log(req.headers.authorization);
    //get auth header value from req
    const bearerheader = req.headers["authorization"];
    //check if bearer is undefined
    if (typeof bearerheader !== "undefined") {
      //splitting the token
      // const bearer = bearerheader.split(' ');
      // const bearertoken = bearer[2];
      const bearertoken = req.headers["authorization"];

      jwt.verify(bearertoken, "secretkey", (err, authdata) => {
        if (err) {
          //forbidden
          console.log(err);
          return res.sendStatus(403);
        } else {
          console.log(authdata);
          next();
        }
      });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
  }
};
