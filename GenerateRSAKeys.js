const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

/**
 * This generates a pair of RSA keys for use in hashing a password
 * and generating JSON web tokens, among other things.
 * @author Cameron Burkholder
 * @date   07/29/2021
 */
function generateRSAKeyPair() {
    // DEFINE THE SCHEME FOR GENERATING THE RSA KEY PAIR.
    const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        }
    });

    // CREATE THE PUBLIC KEY FILE.
    fs.writeFileSync(path.join(__dirname, "id_rsa_pub.pem"), keyPair.publicKey);

    // CREATE THE PRIVATE KEY FILE.
    fs.writeFileSync(path.join(__dirname, "id_rsa_priv.pem"), keyPair.privateKey);
}

// GENERATE THE RSA KEY PAIR.
generateRSAKeyPair();
