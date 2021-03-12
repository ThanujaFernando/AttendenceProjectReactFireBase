// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// // Take the text parameter passed to this HTTP endpoint and insert it into 
// // Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
//   });

const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();
const ref = db.ref("/");
const demoUserName = ref.child("demoUserName");
const secureToken = ref.child("secureToken");
const demoUserId = ref.child("demoUserId");

exports.register = functions.https.onRequest((request, response) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Invalid request method!")
    }
    const { userId, userName } = request.body;
    if (!userId || !userName) {
      throw new Error("Provide userId and userName");
    }
    demoUserName.set(userName);
    demoUserId.set(userId);
    response.send({
      message: "success",
    })
  } catch (error) {
    return response.json({
      message: error.message,
    });
  }
});

// Send data from the nodemcu
exports.insertToken = functions.https.onRequest((request, response) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Invalid request method!")
    }
    const { token } = request.body;
    if (!token) {
      throw new Error("Provide the secureToken");
    }
    secureToken.set(token);
    response.send({
      message: "success",
    })
  } catch (error) {
    return response.json({
      message: error.message,
    });
  }
});

// verify users's token
exports.verifyToken = functions.https.onRequest((request, response) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Invalid request method!")
    }
    const { token } = request.body;
    if (!token) {
      throw new Error("Provide the secureToken");
    }
    // Read current secureToken 
    secureToken.once('value', (snap) => { 
      const savedSecureToken = snap.val();
      if (savedSecureToken === token){
        return response.send({
          message: "success",
          isTokenVerified: true,
        })
      }
      return response.send({
        message: "success",
        isTokenVerified: false,
      })
    });
  } catch (error) {
    return response.json({
      message: error.message,
    });
  }
});


