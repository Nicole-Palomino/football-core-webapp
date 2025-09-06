import CryptoJS from 'crypto-js'

const secretKey = '7d6d7fcc5106f7074841ee272d76c0a6d688963c23c54895bf3138bd1b16cda5'

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}