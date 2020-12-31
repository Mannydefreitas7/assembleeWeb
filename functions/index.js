const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail')
require('dotenv').config()


exports.sendEmail = functions.https.onCall((data, context) => {
  sendEmail(data)
})

const sendEmail = (message) => {

  sgMail.setApiKey('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')

  sgMail
  .send(message)
  .then((data) => {
    return console.log('Email sent', data)
  })
  .catch((error) => {
    console.error(error)
  })
}
