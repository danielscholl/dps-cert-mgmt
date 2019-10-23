const crypto = require('crypto');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let error = false;
  let message;

  // Setup Query Paramaters

  ////////////////
  // &expiry=3600
  ////////////////
  let expiry = 3600;
  if (req.body && req.body.expiry) {
    expiry = req.body.expiry
  }

  ///////////////////////////
  // &policyName=registration
  ///////////////////////////
  let policyName = "registration";
  if (req.body && req.body.policyName) {
    policyName = req.body.policyName
  }

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

  ///////////////////////
  // &idScope=0ne00082BF6
  ///////////////////////
  let idScope;
  if (req.body && req.body.idScope) {
    idScope = req.body.idScope;
  }
  else {
    message = "Please pass a idScope on the body";
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
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: generateSasToken(idScope, registrationId, symmetricKey, policyName, expiry),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  context.done();
};

function generateSasToken(idScope, registrationId, signingKey, policyName, expiresInMins) {
  const sr = idScope + '/registrations/' + registrationId;
  const skn = encodeUriComponentStrict(policyName);
  const se = expiresFromNow(expiresInMins);
  const sig = encodeUriComponentStrict(hmacHash(signingKey, stringToSign(sr, se.toString())));

  let response = {
    input: {
      resourceUri: sr,
      signingKey: signingKey,
      policyName: policyName,
      expires: expiresInMins
    },
    outputs: {
      sasToken: null
    }
  };


  let token = "SharedAccessSignature sr=" + sr + "&sig=" + sig + "&skn=" + skn + "&se=" + se;

  response.outputs.sasToken = token;
  return response;
}


// FUNCTIONS
function hmacHash(password, stringToSign) {
  var hmac = crypto.createHmac('sha256', Buffer.from(password, 'base64'));
  hmac.update(stringToSign);
  return hmac.digest('base64');
}

function stringToSign(resourceUri, expiry) {
  return resourceUri + '\n' + expiry;
}

function encodeUriComponentStrict(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function expiresFromNow(expiry) {
  var raw = (Date.now() / 1000) + expiry;
  return Math.ceil(raw);
}

