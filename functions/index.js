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
