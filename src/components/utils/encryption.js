import { writeToConfig, readFromConfig } from '../utils/configHandler';

async function generateKey() {
    const ivGen = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
    const keyGen = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    return { ivGen, keyGen };
}

function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

async function cryptoKeyToBase64(key) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return arrayBufferToBase64(exported);
}

async function base64ToCryptoKey(base64) {
    const rawKey = base64ToArrayBuffer(base64);
    return await window.crypto.subtle.importKey(
        'raw',
        rawKey,
        {
            name: 'AES-GCM',
        },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function fetchEncryptionKey() {
    const ivBase64 = await readFromConfig("EncryptionIV");
    const keyBase64 = await readFromConfig("EncryptionKey");
    if (!ivBase64 || !keyBase64) {
        const { ivGen, keyGen } = await generateKey();
        const ivGenBase64 = arrayBufferToBase64(ivGen);
        const keyGenBase64 = await cryptoKeyToBase64(keyGen);
        alert("You are about to overwrite encrpytion keys");
        await writeToConfig("EncryptionIV", ivGenBase64);
        await writeToConfig("EncryptionKey", keyGenBase64);

        return { iv: ivGen, key: keyGen };
    } else {
        const iv = base64ToArrayBuffer(ivBase64);
        const key = await base64ToCryptoKey(keyBase64);

        return { iv, key };
    }
}
  
export async function encryptFile(arrayBuffer, key, iv ) {
  const algorithm = {
    name: 'AES-GCM',
    iv: iv,
  };
  const encryptedData = await window.crypto.subtle.encrypt(algorithm, key, arrayBuffer);
  return encryptedData;
}

export async function decryptFile(encryptedData, encryptionKey, iv) {
    const algorithm = { 
        name: "AES-GCM", 
        iv: iv };
    const key = encryptionKey;
    return await crypto.subtle.decrypt(algorithm, key, encryptedData);
  }