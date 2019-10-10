#! /usr/bin/env node
const CryptoJS = require("crypto-js");
const expiresInDays = 30;

// Process Connection String
const args = process.argv.slice(2);
if(args.length < 1){ console.log("Connection String Required"); return -1; }

const connectionString = args[0].split(';', 3);
if(connectionString.length < 3){ console.log("Invalid Connection String"); return -1; }

const hostName = connectionString[0].split('=')[1];
const policyName = connectionString[1].split('=')[1];
const accessKey = connectionString[2].split('=')[1];

if(hostName === undefined || policyName === undefined || accessKey === undefined) {
  console.log("Invalid Connection String");
  return -1;
}


let resourceUri = encodeURIComponent(hostName);
let expiry = Math.ceil((Date.now() / 1000) + expiresInDays * 1440);
let uriExpiry = resourceUri + '\n' + expiry;
let decodedKey = CryptoJS.enc.Base64.parse(accessKey);
let signature = CryptoJS.HmacSHA256(uriExpiry, decodedKey);
let encodedUri = encodeURIComponent(CryptoJS.enc.Base64.stringify(signature));

let token = "SharedAccessSignature sr=" + resourceUri + "&sig=" + encodedUri + "&se=" + expiry + "&skn="+ policyName;
console.log(token);
