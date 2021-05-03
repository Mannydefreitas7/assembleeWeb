const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
var serviceAccount = require('./service-account.json');
const send = require('gmail-send');

exports.emailData = functions.https.onCall((req, context) => {
  try {
    var data = req;
    sendEmail(data)
  } catch(error) {
      console.log(error)
  }
})

exports.deleteAllAnymomous = functions.https.onCall(() => {
  deleteAnymomous()
})

const sendEmail = (message) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        secureConnection: false,
          auth: {
              user: 'assemblee.app@gmail.com',
              pass: 'lufamulhqpcimijt'
          },
            tls: {
              rejectUnAuthorized:true
          }
        });
      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
          reject(error)
        } else {
          transporter.sendMail(message).then(() => resolve(success))
        }
      });
    })
}

const deleteAnymomous = async () => {
  const _admin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://assemblee-5ddb6.firebaseio.com"
  });
  const users = await _admin.auth().listUsers()
  let anynomous = users.users.filter(user => !user.email)
  let res = await _admin.auth().deleteUsers([
    ...anynomous.map(a => a.uid)
  ])
  console.log(res.successCount)
}

