const crypto = require('crypto');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let error = false;
  let message;

  ////////////////
  // expiry=3600
  ////////////////
  let expiry = 3600;
  if (req.body && req.body.expiry) {
    expiry = req.body.expiry
  }

  ////////////////////
  // ConnectionString
  ////////////////////
  let connectionString;
  if (req.body && req.body.connectionString) {
    connectionString = req.body.connectionString;
  }
  else {
    message = "Please pass a connectionString on the body";
    error = true;
  }


  connectionString = connectionString.split(';', 3);

  const hostName = connectionString[0].substring(9);
  const policyName = connectionString[1].substring(20);
  const accessKey = connectionString[2].substring(16);


  if (hostName === undefined || policyName === undefined || accessKey === undefined) {
    message = "Invalid Connection String";
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
      body: generateSasToken(hostName, accessKey, policyName, expiry),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  context.done();
};

function generateSasToken(resourceUri, signingKey, policyName, expiresInMins) {
  const _key = Buffer.from(signingKey, 'base64');
  const sr = resourceUri;
  const skn = encodeUriComponentStrict(policyName);
  const se = expiresFromNow(expiresInMins);
  const sig = encodeUriComponentStrict(hmacHash(_key, stringToSign(sr, se.toString())));

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

