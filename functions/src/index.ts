import {
  logger, https,
} from "firebase-functions";

import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

export const getSavage = https.onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.status(200).json({
    message: "Hello",
  });
});

export const helloWorld = https.onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.status(200).json({
    message: "Hello",
  });
});

export const saveText = https.onRequest(async (req, res) => {
  try {
    if (req.headers["content-type"]) {
      logger.info(req.body.data, {structuredClone: true});

      const newText = await admin.firestore().collection("texts").add({
        text: req.body.data.text,
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
