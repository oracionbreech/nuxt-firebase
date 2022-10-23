import {
  logger, https,
} from "firebase-functions";

import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

export const saveText = https.onRequest(async (req, res) => {
  try {
    if (req.headers["content-type"]) {
      logger.info(req.body.data, {structuredClone: true});


      if (!req.body.data || !req.body.data.text) {
        return cors()(req, res, async () => res.send({
          status: "failed",
          data: "Text should not be empty!",
        }));
      }


      const newText = await admin.firestore().collection("texts").add({
        text: req.body.data.text,
        date: new Date().valueOf(),
      });

      // eslint-disable-next-line max-len
      return cors()(req, res, async () => res.send({
        status: "success",
        data: (await newText.get()).data(),
      }));
    }


    return cors()(req, res, async () => res.status(201).send({
      status: "success",
      data: "pre-flight",
    }));
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});
