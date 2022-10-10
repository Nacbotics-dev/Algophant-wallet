var CryptoJS = require("crypto-js");


const key = "kcoiephilngbhcdikchabnniloliakjo"


export function Encrypt(text) {
    return(CryptoJS.AES.encrypt(text,key).toString())
}

export function EncryptSHA256(text) {
    return(CryptoJS.SHA256(text).toString())
}

export function Decrypt(cipher_text) {
    return(CryptoJS.AES.decrypt(cipher_text, key).toString(CryptoJS.enc.Utf8))
}