import CryptoJS from 'crypto-js'
import { configManager, configDefault } from '../config'

export type CryptConfig = {
    //十六位十六进制数作为密钥
    iv: string
    //十六位十六进制数作为密钥偏移量
    key: string
}

const safety = (key?: string, iv?: string) => {
    const config = configManager.get('uxCrypto') || configDefault.uxCrypto
    key = key != null ? md5(key).substring(8, 24).toUpperCase() : config.key;
    iv = iv != null ? md5(iv).substring(8, 24).toUpperCase() : config.iv;
    let k = CryptoJS.enc.Utf8.parse(key);
    let v = CryptoJS.enc.Utf8.parse(iv);
    let cfg = {
        iv: v,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }
    return { k, v, cfg }
}

//加密方法
const encrypt = function (value: string, key?: string, iv?: string) {
    const { k, cfg } = safety(key, iv);
    let stringify = CryptoJS.enc.Utf8.parse(value);
    let encrypted = CryptoJS.AES.encrypt(stringify, k, cfg);
    return encrypted.ciphertext.toString();
}

// 解密方法
const decrypt = function (value: string, key?: string, iv?: string) {
    const { k, cfg } = safety(key, iv);
    let wordArray = CryptoJS.enc.Hex.parse(value);
    let stringify = CryptoJS.enc.Base64.stringify(wordArray);
    let decrypted = CryptoJS.AES.decrypt(stringify, k, cfg);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const uuid = (length = 16) => {
    // 1. 用 CryptoJS 生成 16 个字节的密码学安全随机数
    const randomWords = CryptoJS.lib.WordArray.random(length);

    // 2. 转换为 Uint8Array 以便操作单个字节
    const bytes = new Uint8Array(
        CryptoJS.enc.Hex.parse(randomWords.toString()).words.flatMap(word => [
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff,
        ])
    );

    // 3. 设置 UUID v4 版本号（第 7 字节的高 4 位为 0100）
    bytes[6] = (bytes[6] & 0x0f) | 0x40;

    // 4. 设置变体标识（第 9 字节的高 2 位为 10）
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    // 5. 格式化为 UUID 字符串
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const md5 = (value: string) => CryptoJS.MD5(value).toString(CryptoJS.enc.Hex)

const sha256 = (value: string) => CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex)

const password = (password: string) => encrypt(sha256(password));

export const uxCrypto = { decrypt, encrypt, sha256, md5, password, uuid }
