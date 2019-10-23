const crypto = require('crypto');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let error = false;
  let message;

  // Setup Query Paramaters

  ////////////////////
  // &symmetricKey=VT5WsRpzz3g+tOzJjLR2kHLrWLa0pwRuz7I0j7IN2TlnGqgVF1O7o2IqTDW11GsCX5mO/mqomVonT7VVtTquwQ==
  ////////////////////
  let symmetricKey;
  if (req.body && req.body.symmetricKey) {
    symmetricKey = req.body.symmetricKey;
  }
  else {
    message = "Please pass a symmetricKey on the body";
    error = true;
  }

  /////////////////////////
  // &registrationId=device
  /////////////////////////
  let registrationId;
  if (req.body && req.body.registrationId) {
    registrationId = req.body.registrationId;
  }
  else {
    message = "Please pass a registrationId on the body";
    error = true;
  }


  /// RESPONSE
  if (error) {
    context.res = {
      status: 400, /* Defaults to 200 */
      body: message
    };
  } else {
    const key = hmacHash(symmetricKey, registrationId);
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        input: {
          registrationId: registrationId,
          signingKey: symmetricKey
        },
        outputs: {
          derivedKey: key
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  context.done();
};

// FUNCTIONS
function hmacHash(password, stringToSign) {
  var hmac = crypto.createHmac('sha256', Buffer.from(password, 'base64'));
  hmac.update(stringToSign);
  return hmac.digest('base64');
}
