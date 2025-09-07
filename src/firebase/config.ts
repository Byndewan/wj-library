import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB3ZsoweOAO1S2R2AYLmcB87IlbuSbjD5M",
  authDomain: "wjlrc-library.firebaseapp.com",
  projectId: "wjlrc-library",
  storageBucket: "wjlrc-library.appspot.com",
  messagingSenderId: "727018080150",
  appId: "1:727018080150:web:788af1b98c2126ba297fb7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;