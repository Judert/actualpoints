import { postToJSON } from "../../../lib/firebase";
import { db, Timestamp } from "../../../lib/firebase-admin";
import applyRateLimit from "../../../lib/applyRateLimit";

export default async function handler(req, res) {
  try {
    applyRateLimit(req, res);
  } catch {
    return response.status(429).send("Too Many Requests");
  }

  try {
    const { slug } = req.query;
    const start = Timestamp.fromMillis(parseInt(slug[0]));
    const limit = parseInt(slug[1]);
    const category = slug[2];
    const temp = (
      await db
        .collection("Article")
        .where("category", "==", category)
        .where("published", "==", true)
        .orderBy("date", "desc")
        .startAfter(start)
        .limit(limit)
        .get()
    ).docs.map(postToJSON);
    res.status(200).json(temp);
  } catch (e) {
    res.status(400).end();
  }
}
