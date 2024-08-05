/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const paypal = require('paypal-rest-sdk');
admin.initializeApp();

paypal.configure({
    'mode': 'sandbox', // Cambiar a 'live' para producción
    'client_id': 'YATvx6H4p1u__U-CWTl1krOutlVy_Xqd-V2khkeJJDWkDUpX7N6K12WeJjtqmNNCC77vFpFVdez0fcXa1',
    'client_secret': 'EKbdoH8UJJiFt1caFfeODNOcqhXwtWLDfASJov6clwIikRBHi4yNqIniKjNLvlk7IBkFN1OnzqA7rnhR'
});

exports.createPayment = functions.https.onRequest((req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://your-app-url.com/success",
            "cancel_url": "https://your-app-url.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": req.body.items
            },
            "amount": {
                "currency": "USD",
                "total": req.body.total
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.status(200).send({ approval_url: payment.links[i].href });
                }
            }
        }
    });
});

exports.executePayment = functions.https.onRequest((req, res) => {
    const paymentId = req.body.paymentId;
    const payerId = { 'payer_id': req.body.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment) {
        if (error) {
            console.log(error.response);
            res.status(500).send(error);
        } else {
            res.status(200).send(payment);
        }
    });
});