import { configManager, configDefault } from '../config'

export type CryptConfig = {
    //十六位十六进制数作为密钥
    iv: string
    //十六位十六进制数作为密钥偏移量
    key: string
}

// ==================== 纯 JS AES-128 实现 ====================

// AES S-Box
const SBOX: number[] = [
    0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
    0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
    0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
    0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
    0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
    0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
    0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
    0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
    0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
    0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
    0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
    0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
    0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
    0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
    0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
    0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
];

// AES 逆 S-Box
const INV_SBOX: number[] = [
    0x52,0x09,0x6a,0xd5,0x30,0x36,0xa5,0x38,0xbf,0x40,0xa3,0x9e,0x81,0xf3,0xd7,0xfb,
    0x7c,0xe3,0x39,0x82,0x9b,0x2f,0xff,0x87,0x34,0x8e,0x43,0x44,0xc4,0xde,0xe9,0xcb,
    0x54,0x7b,0x94,0x32,0xa6,0xc2,0x23,0x3d,0xee,0x4c,0x95,0x0b,0x42,0xfa,0xc3,0x4e,
    0x08,0x2e,0xa1,0x66,0x28,0xd9,0x24,0xb2,0x76,0x5b,0xa2,0x49,0x6d,0x8b,0xd1,0x25,
    0x72,0xf8,0xf6,0x64,0x86,0x68,0x98,0x16,0xd4,0xa4,0x5c,0xcc,0x5d,0x65,0xb6,0x92,
    0x6c,0x70,0x48,0x50,0xfd,0xed,0xb9,0xda,0x5e,0x15,0x46,0x57,0xa7,0x8d,0x9d,0x84,
    0x90,0xd8,0xab,0x00,0x8c,0xbc,0xd3,0x0a,0xf7,0xe4,0x58,0x05,0xb8,0xb3,0x45,0x06,
    0xd0,0x2c,0x1e,0x8f,0xca,0x3f,0x0f,0x02,0xc1,0xaf,0xbd,0x03,0x01,0x13,0x8a,0x6b,
    0x3a,0x91,0x11,0x41,0x4f,0x67,0xdc,0xea,0x97,0xf2,0xcf,0xce,0xf0,0xb4,0xe6,0x73,
    0x96,0xac,0x74,0x22,0xe7,0xad,0x35,0x85,0xe2,0xf9,0x37,0xe8,0x1c,0x75,0xdf,0x6e,
    0x47,0xf1,0x1a,0x71,0x1d,0x29,0xc5,0x89,0x6f,0xb7,0x62,0x0e,0xaa,0x18,0xbe,0x1b,
    0xfc,0x56,0x3e,0x4b,0xc6,0xd2,0x79,0x20,0x9a,0xdb,0xc0,0xfe,0x78,0xcd,0x5a,0xf4,
    0x1f,0xdd,0xa8,0x33,0x88,0x07,0xc7,0x31,0xb1,0x12,0x10,0x59,0x27,0x80,0xec,0x5f,
    0x60,0x51,0x7f,0xa9,0x19,0xb5,0x4a,0x0d,0x2d,0xe5,0x7a,0x9f,0x93,0xc9,0x9c,0xef,
    0xa0,0xe0,0x3b,0x4d,0xae,0x2a,0xf5,0xb0,0xc8,0xeb,0xbb,0x3c,0x83,0x53,0x99,0x61,
    0x17,0x2b,0x04,0x7e,0xba,0x77,0xd6,0x26,0xe1,0x69,0x14,0x63,0x55,0x21,0x0c,0x7d,
];

// Round constants
const RCON: number[] = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// Galois Field multiplication
function xtime(a: number): number {
    return ((a << 1) ^ (((a >> 7) & 1) * 0x1b)) & 0xff;
}

function gfMul(a: number, b: number): number {
    let p = 0;
    let ha = a;
    let hb = b;
    for (let i = 0; i < 8; i++) {
        if (hb & 1) p ^= ha;
        ha = xtime(ha);
        hb >>= 1;
    }
    return p;
}

// AES Key Expansion (AES-128: 16 bytes -> 11 round keys)
function keyExpansion(key: Uint8Array): Uint8Array[] {
    const Nk = 4; // AES-128
    const Nr = 10;
    const totalWords = (Nr + 1) * Nk; // 44 words

    const w: number[] = [];
    // Copy key into w
    for (let i = 0; i < Nk; i++) {
        const offset = i * 4;
        w.push((key[offset]! << 24) | (key[offset + 1]! << 16) | (key[offset + 2]! << 8) | key[offset + 3]!);
    }

    for (let i = Nk; i < totalWords; i++) {
        let temp = w[i - 1]!;
        if (i % Nk === 0) {
            // RotWord
            temp = ((temp << 8) | (temp >>> 24)) & 0xffffffff;
            // SubWord
            temp = (SBOX[(temp >> 24) & 0xff]! << 24) |
                    (SBOX[(temp >> 16) & 0xff]! << 16) |
                    (SBOX[(temp >> 8) & 0xff]! << 8) |
                    SBOX[temp & 0xff]!;
            // XOR with Rcon
            temp ^= (RCON[(i / Nk) - 1]! << 24);
        }
        w.push(w[i - Nk]! ^ temp);
    }

    // Convert to Uint8Array[]
    const roundKeys: Uint8Array[] = [];
    for (let r = 0; r <= Nr; r++) {
        const rk = new Uint8Array(16);
        for (let i = 0; i < 4; i++) {
            const word = w[r * 4 + i]!;
            rk[i * 4] = (word >> 24) & 0xff;
            rk[i * 4 + 1] = (word >> 16) & 0xff;
            rk[i * 4 + 2] = (word >> 8) & 0xff;
            rk[i * 4 + 3] = word & 0xff;
        }
        roundKeys.push(rk);
    }
    return roundKeys;
}

// SubBytes
function subBytes(state: number[]): void {
    for (let i = 0; i < 16; i++) {
        state[i] = SBOX[state[i]!]!;
    }
}

// InvSubBytes
function invSubBytes(state: number[]): void {
    for (let i = 0; i < 16; i++) {
        state[i] = INV_SBOX[state[i]!]!;
    }
}

// ShiftRows
function shiftRows(state: number[]): void {
    const s = state;
    // Row 1: shift left 1
    const t1 = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = t1;
    // Row 2: shift left 2
    const t2 = s[2]; s[2] = s[10]; s[10] = t2;
    const t3 = s[6]; s[6] = s[14]; s[14] = t3;
    // Row 3: shift left 3
    const t4 = s[3]; s[3] = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = t4;
}

// InvShiftRows
function invShiftRows(state: number[]): void {
    const s = state;
    // Row 1: shift right 1
    const t1 = s[13]; s[13] = s[9]; s[9] = s[5]; s[5] = s[1]; s[1] = t1;
    // Row 2: shift right 2
    const t2 = s[10]; s[10] = s[2]; s[2] = t2;
    const t3 = s[14]; s[14] = s[6]; s[6] = t3;
    // Row 3: shift right 3
    const t4 = s[7]; s[7] = s[11]; s[11] = s[15]; s[15] = s[3]; s[3] = t4;
}

// MixColumns
function mixColumns(state: number[]): void {
    for (let col = 0; col < 4; col++) {
        const c = col * 4;
        const s0 = state[c]!;
        const s1 = state[c + 1]!;
        const s2 = state[c + 2]!;
        const s3 = state[c + 3]!;

        state[c]     = gfMul(2, s0) ^ gfMul(3, s1) ^ s2 ^ s3;
        state[c + 1] = s0 ^ gfMul(2, s1) ^ gfMul(3, s2) ^ s3;
        state[c + 2] = s0 ^ s1 ^ gfMul(2, s2) ^ gfMul(3, s3);
        state[c + 3] = gfMul(3, s0) ^ s1 ^ s2 ^ gfMul(2, s3);
    }
}

// InvMixColumns
function invMixColumns(state: number[]): void {
    for (let col = 0; col < 4; col++) {
        const c = col * 4;
        const s0 = state[c]!;
        const s1 = state[c + 1]!;
        const s2 = state[c + 2]!;
        const s3 = state[c + 3]!;

        state[c]     = gfMul(0x0e, s0) ^ gfMul(0x0b, s1) ^ gfMul(0x0d, s2) ^ gfMul(0x09, s3);
        state[c + 1] = gfMul(0x09, s0) ^ gfMul(0x0e, s1) ^ gfMul(0x0b, s2) ^ gfMul(0x0d, s3);
        state[c + 2] = gfMul(0x0d, s0) ^ gfMul(0x09, s1) ^ gfMul(0x0e, s2) ^ gfMul(0x0b, s3);
        state[c + 3] = gfMul(0x0b, s0) ^ gfMul(0x0d, s1) ^ gfMul(0x09, s2) ^ gfMul(0x0e, s3);
    }
}

// AddRoundKey
function addRoundKey(state: number[], roundKey: Uint8Array): void {
    for (let i = 0; i < 16; i++) {
        state[i] ^= roundKey[i]!;
    }
}

// AES-128 Encrypt single block (column-major state)
function aesEncryptBlock(block: Uint8Array, roundKeys: Uint8Array[]): Uint8Array {
    // Convert to column-major state
    const state: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            state[row + col * 4] = block[col * 4 + row]!;
        }
    }

    addRoundKey(state, roundKeys[0]!);

    for (let round = 1; round < 10; round++) {
        subBytes(state);
        shiftRows(state);
        mixColumns(state);
        addRoundKey(state, roundKeys[round]!);
    }

    // Final round (no MixColumns)
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, roundKeys[10]!);

    // Convert back to bytes (column-major)
    const out = new Uint8Array(16);
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            out[col * 4 + row] = state[row + col * 4]!;
        }
    }
    return out;
}

// AES-128 Decrypt single block
function aesDecryptBlock(block: Uint8Array, roundKeys: Uint8Array[]): Uint8Array {
    const state: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            state[row + col * 4] = block[col * 4 + row]!;
        }
    }

    addRoundKey(state, roundKeys[10]!);

    for (let round = 9; round >= 1; round--) {
        invShiftRows(state);
        invSubBytes(state);
        addRoundKey(state, roundKeys[round]!);
        invMixColumns(state);
    }

    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, roundKeys[0]!);

    const out = new Uint8Array(16);
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            out[col * 4 + row] = state[row + col * 4]!;
        }
    }
    return out;
}

// PKCS7 Pad
function pkcs7Pad(data: Uint8Array): Uint8Array {
    const padLen = 16 - (data.length % 16);
    const padded = new Uint8Array(data.length + padLen);
    padded.set(data);
    for (let i = data.length; i < padded.length; i++) {
        padded[i] = padLen;
    }
    return padded;
}

// PKCS7 Unpad
function pkcs7Unpad(data: Uint8Array): Uint8Array {
    const padLen = data[data.length - 1]!;
    return data.subarray(0, data.length - padLen);
}

// AES-128-CBC Encrypt
function aes128CbcEncrypt(iv: Uint8Array, key: Uint8Array, plaintext: Uint8Array): Uint8Array {
    const roundKeys = keyExpansion(key);
    const padded = pkcs7Pad(plaintext);
    const ciphertext = new Uint8Array(padded.length);

    let prev = iv;
    for (let block = 0; block < padded.length; block += 16) {
        // XOR with previous ciphertext block (or IV)
        const xored = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            xored[i] = padded[block + i]! ^ prev[i]!;
        }
        // Encrypt
        const encrypted = aesEncryptBlock(xored, roundKeys);
        ciphertext.set(encrypted, block);
        prev = encrypted;
    }
    return ciphertext;
}

// AES-128-CBC Decrypt
function aes128CbcDecrypt(iv: Uint8Array, key: Uint8Array, ciphertext: Uint8Array): Uint8Array {
    const roundKeys = keyExpansion(key);
    const plaintext = new Uint8Array(ciphertext.length);

    let prev = iv;
    for (let block = 0; block < ciphertext.length; block += 16) {
        // Decrypt
        const decrypted = aesDecryptBlock(ciphertext.subarray(block, block + 16), roundKeys);
        // XOR with previous ciphertext block (or IV)
        for (let i = 0; i < 16; i++) {
            plaintext[block + i] = decrypted[i]! ^ prev[i]!;
        }
        prev = ciphertext.subarray(block, block + 16);
    }
    return pkcs7Unpad(plaintext);
}

// ==================== SHA-256 (纯JS同步实现) ====================

function sha256(value: string): string {
    // UTF-8 encode
    const bytes: number[] = Array.from(new TextEncoder().encode(value));

    // Append bit length
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 0; i < 8; i++) {
        bytes.push((bitLen >>> (i * 8)) & 0xff);
    }

    // SHA-256 constants
    const K: number[] = [
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
    ];

    // Initial hash values
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    const rotr = (x: number, n: number) => ((x >>> n) | (x << (32 - n))) >>> 0;
    const ch = (x: number, y: number, z: number) => (x & y) ^ (~x & z);
    const maj = (x: number, y: number, z: number) => (x & y) ^ (x & z) ^ (y & z);
    const bigSigma0 = (x: number) => rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
    const bigSigma1 = (x: number) => rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
    const smallSigma0 = (x: number) => rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
    const smallSigma1 = (x: number) => rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);

    for (let offset = 0; offset < bytes.length; offset += 64) {
        const w: number[] = [];
        for (let i = 0; i < 16; i++) {
            w.push(
                (bytes[offset + i * 4]! << 24) |
                (bytes[offset + i * 4 + 1]! << 16) |
                (bytes[offset + i * 4 + 2]! << 8) |
                bytes[offset + i * 4 + 3]!
            );
        }
        for (let i = 16; i < 64; i++) {
            w.push((smallSigma1(w[i - 2]!) + w[i - 7]! + smallSigma0(w[i - 15]!) + w[i - 16]!) >>> 0);
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

        for (let i = 0; i < 64; i++) {
            const T1 = (h + bigSigma1(e) + ch(e, f, g) + K[i] + w[i]!) >>> 0;
            const T2 = (bigSigma0(a) + maj(a, b, c)) >>> 0;
            h = g;
            g = f;
            f = e;
            e = (d + T1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) >>> 0;
        }

        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
        h5 = (h5 + f) >>> 0;
        h6 = (h6 + g) >>> 0;
        h7 = (h7 + h) >>> 0;
    }

    const toHex = (n: number) => n.toString(16).padStart(8, '0');
    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
}

// ==================== MD5 (同步，保持原实现) ====================

const md5 = (value: string): string => {
    // UTF-8 编码
    const bytes: number[] = Array.from(new TextEncoder().encode(value));

    // 补位：追加 0x80，然后补 0 直到长度 ≡ 56 (mod 64)，最后追加 64 位原始长度（小端）
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 0; i < 8; i++) {
        bytes.push((bitLen >>> (i * 8)) & 0xff);
    }

    // 初始化链接变量
    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    const S = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
    ];
    const K: number[] = [];
    for (let i = 0; i < 64; i++) {
        K.push(Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0);
    }

    const leftRotate = (x: number, c: number) => ((x << c) | (x >>> (32 - c))) >>> 0;

    for (let offset = 0; offset < bytes.length; offset += 64) {
        const M: number[] = [];
        for (let i = 0; i < 16; i++) {
            M.push(
                (bytes[offset + i * 4]! |
                    (bytes[offset + i * 4 + 1]! << 8) |
                    (bytes[offset + i * 4 + 2]! << 16) |
                    (bytes[offset + i * 4 + 3]! << 24)) >>> 0
            );
        }

        let A = a0;
        let B = b0;
        let C = c0;
        let D = d0;

        for (let i = 0; i < 64; i++) {
            let F: number;
            let g: number;
            if (i < 16) {
                F = (B & C) | (~B & D);
                g = i;
            } else if (i < 32) {
                F = (D & B) | (~D & C);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                F = B ^ C ^ D;
                g = (3 * i + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * i) % 16;
            }

            F = (F + A + K[i]! + M[i]!) >>> 0;
            A = D;
            D = C;
            C = B;
            B = (B + leftRotate(F, S[i]!)) >>> 0;
        }

        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
    }

    // 输出小端 hex
    const toHex = (n: number) => {
        let s = '';
        for (let i = 0; i < 4; i++) {
            s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
        }
        return s;
    };

    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
};

// ==================== UUID (同步，保持原实现) ====================

const uuid = (length = 16) => {
    const bytes = new Uint8Array(length);
    // 使用 crypto.getRandomValues (浏览器环境) 或 crypto.randomBytes (Node)
    // 在浏览器中 crypto 全局可用
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
    } else {
        // 降级：使用 Math.random (不推荐用于安全场景)
        for (let i = 0; i < length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
};

// ==================== 高层 API (全部同步) ====================

// 获取/派生 key 和 iv (同步)
const safety = (key?: string, iv?: string) => {
    const config = configManager.get('uxCrypto') || configDefault.uxCrypto;
    // 注意：原来用 md5 派生，现在改用 sha256，历史密文的 key/iv 会完全不同
    const rawKey = key != null
        ? sha256(key).substring(8, 24).toUpperCase()
        : config.key;
    const rawIv = iv != null
        ? sha256(iv).substring(8, 24).toUpperCase()
        : config.iv;

    const keyBytes = new TextEncoder().encode(rawKey);
    const ivBytes = new TextEncoder().encode(rawIv);

    return { keyBytes, ivBytes };
};

// 同步加密
const encrypt = function (value: string, key?: string, iv?: string) {
    const { keyBytes, ivBytes } = safety(key, iv);
    const plaintext = new TextEncoder().encode(value);
    const ciphertext = aes128CbcEncrypt(ivBytes, keyBytes, plaintext);
    return Array.from(new Uint8Array(ciphertext), b =>
        b.toString(16).padStart(2, '0')
    ).join('');
};

// 同步解密
const decrypt = function (value: string, key?: string, iv?: string) {
    const { keyBytes, ivBytes } = safety(key, iv);
    const ciphertext = new Uint8Array(
        value.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    const decrypted = aes128CbcDecrypt(ivBytes, keyBytes, ciphertext);
    return new TextDecoder().decode(decrypted);
};

// 密码加密 (同步)
const password = (password: string) => encrypt(sha256(password));

export const uxCrypto = { decrypt, encrypt, sha256, md5, password, uuid };
