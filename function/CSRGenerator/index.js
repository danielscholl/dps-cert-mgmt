const crypto = require('crypto');
// const ec_pem = require('ec-pem');

var algorithm = 'secp521r1';

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  let error = false;
  let message;

  // Setup Query Paramaters

  /////////////////////////
  // &subjectName=device
  /////////////////////////
  let subjectName;
  if (req.body && req.body.subjectName) {
    subjectName = req.body.subjectName;
  }
  else {
    message = "Please pass a subjectName on the body";
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
      body: generateCSR(subjectName),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  context.done();
};


function generateCSR(subjectName) {

  let response = {
    input: {
      subjectName: subjectName
    },
    outputs: {
      csr: "MIHQMHcCAQAwFTETMBEGA1UEAxMKdWMyRGV2aWNlNDBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABLuEoek4I/0Mm3NGRaJSMKYjV8ZsCyo/IGj8ingl/+tu2A37yCAd7dWKQGpA8khdH7767triEc3LBmMbcX9YX3OgADAKBggqhkjOPQQDAgNJADBGAiEA/0voYfHO3IGUNjuPGM0OWExIQyClvNMQzEJRt1gKCBECIQC3bD07eipBrzz8gCW6J5U79Ff2sgPNHr8sQqfX0enVvw=="
    }
  };
  return response;
}


// function digest(message) {
//   var hasher = crypto.createHash('sha512');
//   hasher.update(message);
//   return hasher.digest('hex');
// }

// function generate() {
//   var curve = crypto.createECDH(algorithm);
//   curve.generateKeys();
//   return {
//     privateKey: curve.getPrivateKey('hex'),
//     publicKey: curve.getPublicKey('hex')
//   };
// }

// function recreate(privateKey) {
//   var curve = crypto.createECDH(algorithm);
//   curve.setPrivateKey(privateKey, 'hex');
//   return {
//     privateKey: curve.getPrivateKey('hex'),
//     publicKey: curve.getPublicKey('hex')
//   };
// }

// function sign(privateKey, message) {
//   var curve = crypto.createECDH(algorithm);
//   curve.setPrivateKey(privateKey, 'hex');
//   var pem = ec_pem(curve, algorithm);
//   var signer = crypto.createSign('ecdsa-with-SHA1');
//   signer.update(message);
//   return signer.sign(pem.encodePrivateKey(), 'base64');
// }

// function verify(publicKey, message, signature) {
//   var curve = crypto.createECDH(algorithm);
//   curve.setPublicKey(publicKey, 'hex');
//   var pem = ec_pem(curve, algorithm);
//   var verifier = crypto.createVerify('ecdsa-with-SHA1');
//   verifier.update(message);
//   return verifier.verify(pem.encodePublicKey(), signature, 'base64');
// }

// function encrypt(publicKey, plaintext) {
//   // generate and encrypt a 32-byte symmetric key
//   var curve = crypto.createECDH(algorithm);
//   curve.generateKeys();
//   var seed = curve.getPublicKey('hex');  // use the new public key as the seed
//   var key = curve.computeSecret(publicKey, 'hex').slice(0, 32);  // take only first 32 bytes

//   // encrypt the message using the symmetric key
//   var iv = crypto.randomBytes(12);
//   var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
//   var ciphertext = cipher.update(plaintext, 'utf8', 'base64');
//   ciphertext += cipher.final('base64');
//   var tag = cipher.getAuthTag();
//   return {
//     iv: iv,
//     tag: tag,
//     seed: seed,
//     ciphertext: ciphertext
//   };
// }

// function decrypt(privateKey, message) {
//   // decrypt the 32-byte symmetric key
//   var seed = message.seed;
//   var curve = crypto.createECDH(algorithm);
//   curve.setPrivateKey(privateKey, 'hex');
//   var key = curve.computeSecret(seed, 'hex').slice(0, 32);  // take only first 32 bytes

//   // decrypt the message using the symmetric key
//   var iv = message.iv;
//   var tag = message.tag;
//   var ciphertext = message.ciphertext;
//   var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
//   decipher.setAuthTag(tag);
//   var plaintext = decipher.update(ciphertext, 'base64', 'utf8');
//   plaintext += decipher.final('utf8');
//   return plaintext;
// }
