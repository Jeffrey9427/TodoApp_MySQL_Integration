import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCOKy7OLdtvnpK9kIbKO2ADhyxPzFAFYj0",
    authDomain: "todo-app-with-firebase-60437.firebaseapp.com",
    projectId: "todo-app-with-firebase-60437",
    storageBucket: "todo-app-with-firebase-60437.appspot.com",
    messagingSenderId: "635247439295",
    appId: "1:635247439295:web:b0456caf16b0165df7450a",
    storageBucket: "gs://todo-app-with-firebase-60437.appspot.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export default app