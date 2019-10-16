#! /usr/bin/env node
const crypto = require('crypto');

// Process Input Arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log("For Global Endpoint Token please use the following arguments: {{registrationId}} {{idScope}} {{symmetricKey}}");
  return -1;
}
const registrationId = args[0];
const idScope = args[1];
const _key = args[2];

const keyName = "registration";
const sr = idScope + '/registrations/' + registrationId;
const skn = encodeUriComponentStrict(keyName);
const se = anHourFromNow();
const sig = encodeUriComponentStrict(hmacHash(_key, stringToSign(sr, se.toString())));
let token = "SharedAccessSignature sr=" + sr + "&sig=" + sig + "&skn=" + skn + "&se=" + se;
console.log(token);

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

function anHourFromNow() {
  var raw = (Date.now() / 1000) + 3600;
  return Math.ceil(raw);
}
