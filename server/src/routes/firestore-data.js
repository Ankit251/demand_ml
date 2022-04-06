var express = require("express");
var router = express.Router();
const { 
    addUserToFirestore,
    addRoleToFirestore,
    getRoleFromFirestore,
    getUserFromFirestore,
    getAccountsFromFirestore,
    deleteRoleFromFirestore,
    deleteUserFromFirestore } = require("../services/firestore");
const { addUserToFirebase, deleteUserFromFirebase } = require("../services/firebase");



router.post("/adduser", async function (req, res, next) {
    try {
        let data = req.body;
        let { password } = req.query;
        console.log(data);
        const respFromFB = await addUserToFirebase(data, password);
        res.status(200).json(respFromFB);
      } catch (err) {
        console.log(err);
        next(err);
      }
});

router.get("/getuser", async function (req, res, next) {
    try {
        const response = await getUserFromFirestore();
        res.status(200).json({users: response});
      } catch (err) {
        console.log(err);
        next(err);
      }
});

router.post("/addrole", async function (req, res, next) {
    try {
        let data = req.body;
        console.log(data);
        const response = await addRoleToFirestore(data);
        res.status(200).json('Role Added');
      } catch (err) {
        console.log(err);
        next(err);
      }
});

router.delete("/deleteuser", async function (req, res, next) {
  try {
      let { id, email } = req.query;
      await deleteUserFromFirebase(id, email);
      res.status(200).json('User deleted');
    } catch (err) {
      console.log(err);
      next(err);
    }
});

router.get("/getrole", async function (req, res, next) {
    try {
        const response = await getRoleFromFirestore();
        res.status(200).json({roles: response});
      } catch (err) {
        console.log(err);
        next(err);
      }
});

router.delete("/deleterole", async function (req, res, next) {
  try {
      let { id } = req.query;
      await deleteRoleFromFirestore(id);
      res.status(200).json('User deleted');
    } catch (err) {
      console.log(err);
      next(err);
    }
});

router.get("/getaccounts", async function (req, res, next) {
    try {
        const response = await getAccountsFromFirestore();
        res.status(200).json({response});
      } catch (err) {
        console.log(err);
        next(err);
      }
});

module.exports = router;
