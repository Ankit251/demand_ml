const { Firestore } = require("@google-cloud/firestore");
const { GCS_PROJECT } = require("../../config");
import path from "path";

const firestore = new Firestore();


exports.addUserToFirestore = async function (data) {
    /**
     * This function add new user data in user
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const res = await firestore.collection('Users').doc(data.email).set(data);
        return res;
    } catch (err) {
      console.log(err);
    }
  };

  exports.getUserFromFirestore = async function () {
    /**
     * This function add new role to role
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Users').get();
        let temp = [];
        response.docs.forEach((doc) => {
            temp.push(doc.data())
        });
        return temp;
    } catch (err) {
      console.log(err);
    }
  };

  exports.addRoleToFirestore = async function (data) {
    /**
     * This function add new role to role
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const res = await firestore.collection('Roles').doc(data.roleName).set(data);
        return res;
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.getRoleFromFirestore = async function () {
    /**
     * This function add new role to role
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Roles').get();
        let temp = [];
        response.docs.forEach((doc) => {
            temp.push(doc.data())
        });
        return temp;
    } catch (err) {
      console.log(err);
    }
  };

  exports.getAccountsFromFirestore = async function () {
    /**
     * This function get accounts from accounts
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Accounts').get();
        let temp = [];
        response.docs.forEach((doc) => {
            temp.push(doc.data())
        });
        return temp;
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.addExportStatusToFirestore = async function (data) {
    /**
     * This function add status to exports
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const res = await firestore.collection('Export').doc("status").set(data);
        return res;
    } catch (err) {
      console.log(err);
    }
  };

  exports.getExportStatusFromFirestore = async function () {
    /**
     * This function get status from the exports
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Export').doc("status").get();
        console.log(response.data());
        return response.data();
    } catch (err) {
      console.log(err);
    }
  };

  exports.deleteRoleFromFirestore = async function (id) {
    /**
     * This function delete role from roole
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Roles').doc(id).delete();
        return response;
    } catch (err) {
      console.log(err);
    }
  };

  exports.deleteUserFromFirestore = async function (id) {
    /**
     * This function delete user from user
     * collections in firestore.
     *
     * Parameters:
     *    -
     * response:
     *    result: array<object>
     */
    try {
        const response = await firestore.collection('Users').doc(id).delete();
        return response;
    } catch (err) {
      console.log(err);
    }
  };
  