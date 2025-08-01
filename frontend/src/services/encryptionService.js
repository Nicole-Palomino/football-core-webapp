import CryptoJS from 'crypto-js'

const secretKey = '7d6d7fcc5106f7074841ee272d76c0a6d688963c23c54895bf3138bd1b16cda5'

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const formatFecha = (fecha) => {
    const [year, month, day] = fecha.split("-"); // Dividimos "2025-02-12"
    return `${day}-${month}-${year.slice(-2)}`; // Retornamos "12-02-25"
}

export const formatFechaHora = (fechaIso) => {
    const fechaObj = new Date(fechaIso)
    const day = String(fechaObj.getDate()).padStart(2, "0")
    const month = String(fechaObj.getMonth() + 1).padStart(2, "0")
    const year = String(fechaObj.getFullYear()).slice(-2)
    const hours = String(fechaObj.getHours()).padStart(2, "0")
    const minutes = String(fechaObj.getMinutes()).padStart(2, "0")
    return `${day}-${month}-${year} ${hours}:${minutes}`
}