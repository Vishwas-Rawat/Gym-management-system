// src/services/cryptoService.js

const ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

export const cryptoService = {
  // 1. Generate Key Pair
  generateKeyPair: async () => {
    return await window.crypto.subtle.generateKey(
      ALGORITHM,
      true, // extractable
      ["encrypt", "decrypt"]
    );
  },

  // 2. Export Public Key to PEM
  exportPublicKey: async (key) => {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsBase64 = window.btoa(String.fromCharCode(...new Uint8Array(exported)));
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  },

  // 3. Import Public Key from PEM
  importPublicKey: async (pem) => {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
      pem.indexOf(pemHeader) + pemHeader.length,
      pem.indexOf(pemFooter)
    ).replace(/\s/g, ""); // remove whitespace

    // base64 decode
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer.buffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"]
    );
  },

  // 4. Export Private Key (for local storage) - using JWK for simplicity
  exportPrivateKey: async (key) => {
    const exported = await window.crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
  },

  // 5. Import Private Key
  importPrivateKey: async (jsonStr) => {
    const jwk = JSON.parse(jsonStr);
    return await window.crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
  },

  // 6. Encrypt Message
  encrypt: async (publicKey, text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      data
    );
    return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  },

  // 7. Decrypt Message
  decrypt: async (privateKey, ciphertext) => {
    try {
      const binaryString = window.atob(ciphertext);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        binaryData
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (e) {
      console.error("Decryption failed", e);
      return "[Decryption Failed]";
    }
  }
};
