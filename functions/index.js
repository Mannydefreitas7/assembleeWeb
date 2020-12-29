const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail')
require('dotenv').config()


exports.sendEmail = functions.https.onCall((data, context) => {
  sendEmail(data)
})

const sendEmail = (body) => {

  sgMail.setApiKey('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')
  const msg = {
    to: body.email, // Change to your recipient
    from: 'West Hudson French <assemblee.app@gmail.com>', // Change to your verified sender
    subject: body.subject,
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    attachments: [
      {
        content: body.data,
        type: 'application/pdf',
        filename: body.title,
      }
    ]
  }

  sgMail
  .send(msg)
  .then((data) => {
    return console.log('Email sent', data)
  })
  .catch((error) => {
    console.error(error)
  })
}
