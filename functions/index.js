const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.articleUserUpdate = functions.firestore
  .document("User/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    if (
      data.displayName == previousData.displayName &&
      data.photoURL == previousData.photoURL &&
      data.desc == previousData.desc
    ) {
      return null;
    }

    db.collection("Article")
      .where("uid", "==", context.params.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({
            displayName: data.displayName,
            photoURL: data.photoURL,
            desc: data.desc,
          });
        });
      })
      .catch((error) => {
        functions.logger.error(error);
      });
  });

// On sign up.
exports.processValidationSignIn = functions.auth
  .user()
  .onCreate(async (user) => {
    db.collection("Email")
      .doc(user.email)
      .get()
      .then((doc) => {
        try {
          admin.auth().setCustomUserClaims(user.uid, {
            verified: doc.exists,
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });

// Email add/remove from db
exports.processValidationAddRemove = functions.firestore
  .document("Email/{email}")
  .onWrite((change, context) => {
    try {
      admin
        .auth()
        .getUserByEmail(context.params.email)
        .then(function (userRecord) {
          admin.auth().setCustomUserClaims(userRecord.uid, {
            verified: change.after.exists,
          });
        })
        .catch(function (error) {
          console.log("Error fetching user data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  });
