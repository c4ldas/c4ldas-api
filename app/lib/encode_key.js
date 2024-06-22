import fs from 'fs';
import CryptoJS from 'crypto-js';

const env = process.env.ENVIRONMENT;

export default function decrypt(encryptedApiKey) {
  if (env != "dev") return;

  const encryptionKeyFilePath = process.cwd() + '/encryption_key';
  const encryptionKey = readEncryptionKeyFromFile(encryptionKeyFilePath);

  if (encryptionKey) {
    // console.log('Encryption key read from file:', encryptionKeyFilePath);
    const decryptedApiKey = decryptData(encryptedApiKey, encryptionKey);
    // console.log("Decrypted API Key:", decryptedApiKey);
    return decryptedApiKey;

  } else {
    console.error('Failed to read encryption key from file.');
    return "Failed to read encryption key from file.";
  }
}

// Function to read the encryption key from file
function readEncryptionKeyFromFile(filePath) {
  try {
    // Read the content of the file synchronously
    const key = fs.readFileSync(filePath, 'utf8').trim(); // trim() removes any whitespace or newline characters
    return key;
  } catch (err) {
    console.error('Error reading encryption key:', err);
    return null;
  }
}

// Function to encrypt data using AES with the encryption key
function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}

// Function to decrypt data using AES with the encryption key
function decryptData(encryptedData, key) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}




