import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "@firebase/storage";
import firebaseConfig from "./config";

// Initialize Firebase and Firebase Storage
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Upload a file to Firebase Storage
const uploadFile = async (file: File) => {
  const storageRef = ref(storage, file.name);

  const snapshot = await uploadBytes(storageRef, file).catch((e) =>
    console.error("Error uploading file:", e),
  );

  if (!snapshot) return "";

  return await getDownloadURL(snapshot.ref);
};

// Delete a file from Firebase Storage
const deleteFile = (filename: string) => {
  const storageRef = ref(storage, filename);

  deleteObject(storageRef).catch((e) => {
    console.error("Error deleting file:", e);
  });
};

export { uploadFile, deleteFile };
