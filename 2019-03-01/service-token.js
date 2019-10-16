#! /usr/bin/env node
const crypto = require('crypto');


// Process Connection String
const args = process.argv.slice(2);
if (args.length < 1) { console.log("Connection String Required"); return -1; }

const connectionString = args[0].split(';', 3);
if (connectionString.length < 3) { console.log("Invalid Connection String"); return -1; }

const hostName = connectionString[0].substring(9);
const policyName = connectionString[1].substring(20);
const accessKey = connectionString[2].substring(16);

if (hostName === undefined || policyName === undefined || accessKey === undefined) {
  console.log("Invalid Connection String");
  return -1;
}


const _key = Buffer.from(accessKey, 'base64');
const keyName = policyName;
const sr = hostName;
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
