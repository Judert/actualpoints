const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.articleUserUpdate = functions.firestore
  .document("User/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    // We are not editing the User here so there can't be an infinite loop
    // if (
    //   data.displayName == previousData.displayName &&
    //   data.photoURL == previousData.photoURL &&
    //   data.desc == previousData.desc
    // ) {
    //   return null;
    // }

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
          functions.logger.error(error);
        }
      })
      .catch((error) => {
        functions.logger.error("Error getting document:", error);
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
          functions.logger.error("Error fetching user data:", error);
        });
    } catch (error) {
      functions.logger.error(error);
    }
  });

exports.tagCounts = functions.pubsub
  .schedule("every 12 hours")
  .onRun(async (context) => {
    db.collection("Article")
      .where("published", "==", true)
      .get()
      .then((snapshot) => {
        const promises = [];
        snapshot.forEach((doc) => {
          doc.data().tags.forEach((tag) => {
            promises.push(tag.id);
          });
        });
        return Promise.all(promises);
      })
      .then((tags) => {
        const counts = {};
        tags.forEach(function (x) {
          counts[x] = (counts[x] || 0) + 1;
        });
        db.collection("Tag")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              if (counts[doc.id]) {
                doc.ref.update({
                  count: counts[doc.id],
                });
              } else {
                doc.ref.delete();
              }
            });
          })
          .catch((error) => {
            functions.logger.error("TAG_UPDATE_FAILED: ", error);
          });
      })
      .catch((error) => {
        functions.logger.error("ARTICLE_GET_FAILED: ", error);
      });
  });

exports.articleSlideCreate = functions.firestore
  .document("Article/{articleId}")
  .onUpdate((change, context) => {
    const data = change.after.data();

    db.collection("Slide")
      .doc(context.params.articleId)
      .set({
        title1: data.title,
        title2: data.title,
        desc: data.subtitle,
        img: data.image,
        alt: data.alt,
        link: "/article/" + context.params.articleId,
        active: false,
        order: 9,
      })
      .catch((error) => {
        functions.logger.error(error);
      });
  });
