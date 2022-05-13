const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.articleUserUpdate = functions.database
  .ref("/User/{userId}")
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    // We'll only update if the name has changed.
    // This is crucial to prevent infinite loops.
    if (
      data.displayName == previousData.displayName &&
      data.photoURL == previousData.photoURL &&
      data.desc == previousData.desc
    ) {
      return null;
    }

    db.collection("Article")
      .where("userId", "==", context.params.userId)
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
