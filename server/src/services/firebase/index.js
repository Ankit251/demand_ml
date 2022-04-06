const { getAuth } = require("firebase-admin/auth");
const { addUserToFirestore, deleteUserFromFirestore } = require(".././firestore");


exports.addUserToFirebase = async function (data, password) {
    try {
        getAuth()
        .createUser({
            email: data.email,
            emailVerified: false,
            password: password,
            displayName: data.userName
        })
        .then((userRecord) => {
             data.uid = userRecord.uid;
             addUserToFirestore(data);
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);

        })
        .catch((error) => {
            console.log('Error creating new user:', error);
        });
    } catch (err) {
        console.log(err)
    }
}

exports.deleteUserFromFirebase = async function (id, email) {
    try {
        getAuth()
        .deleteUser(id)
        .then(() => {
          deleteUserFromFirestore(email)
          console.log('Successfully deleted user');
        })
        .catch((error) => {
          console.log('Error deleting user:', error);
        });
    } catch (err) {
        console.log(err)
    }
}

// exports.resetPassword = async function (email) {
//     try {
//         // Admin SDK API to generate the password reset link.
//         getAuth()
//         .generatePasswordResetLink(email)
//         .then((link) => {
//             // Construct password reset email template, embed the link and send
//             // using custom SMTP server.
//             //return sendCustomPasswordResetEmail(userEmail, displayName, link);
//             console.log(link)
//         })
//         .catch((err) => {
//             // Some error occurred.
//             console.log(err);
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }
