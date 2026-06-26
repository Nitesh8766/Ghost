/*
  GhostLayer client residue.
  Inspect: DevTools > Application > IndexedDB > ghostVault > secrets > final-vault
*/
const GHOST_VAULT_RECORD = {
  "id": "final-vault",
  "kdf": "PBKDF2-HMAC-SHA256",
  "iterations": 250000,
  "cipher": "AES-256-GCM",
  "password_format": "city-date-codename",
  "salt": "R4GnotSlMObs6aVcFktGzQ==",
  "iv": "Oxy3GY3ILvvCOban",
  "ciphertext": "GizYVBNbTr6H+p6+8+BbagDh7U8FoKMYydBU8nW2KgFzkkBBnC4T/347UUrslvB7oVqUO4swWBfjQpecN5lgWAHBKninmzdfdpLo4akzQmZwOc1F90IKMd6Fd9jMXeMM0ceV0bmcCIQTwKv+"
};

async function registerGhostWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js", { scope: "./" });
      console.log("[ghost] offline residue registered");
    } catch (err) {
      console.warn("[ghost] service worker failed", err);
    }
  }
}

function openGhostDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ghostVault", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("secrets")) {
        db.createObjectStore("secrets", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function seedVault() {
  const db = await openGhostDB();
  const tx = db.transaction("secrets", "readwrite");
  tx.objectStore("secrets").put(GHOST_VAULT_RECORD);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

registerGhostWorker();
seedVault().catch(() => {});
