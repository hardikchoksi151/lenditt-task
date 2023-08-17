const CryptoJS = require("crypto-js");
require("dotenv").config();

exports.encryptNumber = (number) =>
  CryptoJS.AES.encrypt(number, process.env.ENC_SECRET).toString();

exports.decryptNumber = (encryptedNumber) =>
  CryptoJS.AES.decrypt(encryptedNumber, process.env.ENC_SECRET).toString(
    CryptoJS.enc.Utf8
  );

exports.generateBlindIndex = (number) => {
  return CryptoJS.HmacSHA256(number, process.env.HMAC_SECRET).toString();
};
