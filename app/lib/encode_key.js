// Replacement for encode_key_old.js that used CryptoJS (deprecated package)

import fs from 'fs';
import crypto from 'node:crypto';

const env = process.env.ENVIRONMENT;

export default function decrypt(encryptedApiKey) {
  if (env !== "dev") return;

  const encryptionKeyFilePath = process.cwd() + '/encryption_key';
  const encryptionKey = readEncryptionKeyFromFile(encryptionKeyFilePath);

  if (encryptionKey) {
    const decryptedApiKey = decryptData(encryptedApiKey, encryptionKey);
    return decryptedApiKey;
  } else {
    console.error('Failed to read encryption key from file.');
    return "Failed to read encryption key from file.";
  }
}

function readEncryptionKeyFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch (err) {
    console.error('Error reading encryption key:', err);
    return null;
  }
}

// Emulates OpenSSL/CryptoJS EVP_BytesToKey key derivation
function deriveKeyAndIv(password, salt) {
  let derivedBytes = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derivedBytes.length < 48) { // 32 bytes key + 16 bytes IV
    const hasher = crypto.createHash('md5');
    hasher.update(Buffer.concat([block, Buffer.from(password, 'utf8'), salt]));
    block = hasher.digest();
    derivedBytes = Buffer.concat([derivedBytes, block]);
  }

  return {
    key: derivedBytes.subarray(0, 32),
    iv: derivedBytes.subarray(32, 48)
  };
}

function encryptData(data, password) {
  const salt = crypto.randomBytes(8);
  const { key, iv } = deriveKeyAndIv(password, salt);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // OpenSSL header "Salttedd__" + 8-byte salt + encrypted ciphertext
  const openSslHeader = Buffer.from('Salted__', 'utf8');
  const payload = Buffer.concat([openSslHeader, salt, encrypted]);

  return payload.toString('base64');
}

function decryptData(encryptedBase64, password) {
  const cipherBuffer = Buffer.from(encryptedBase64, 'base64');

  // Check OpenSSL "Salted__" header
  const openSslHeader = cipherBuffer.subarray(0, 8).toString('utf8');
  if (openSslHeader !== 'Salted__') {
    throw new Error('Invalid OpenSSL header');
  }

  const salt = cipherBuffer.subarray(8, 16);
  const ciphertext = cipherBuffer.subarray(16);

  const { key, iv } = deriveKeyAndIv(password, salt);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(ciphertext, undefined, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}