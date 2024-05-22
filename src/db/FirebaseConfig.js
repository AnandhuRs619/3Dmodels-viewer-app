
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCBwn4EIKev_SYJ6nRQwtD9PLQhKu2BrO4",
    authDomain: "d-model-viewer-e5088.firebaseapp.com",
    projectId: "d-model-viewer-e5088",
    storageBucket: "d-model-viewer-e5088.appspot.com",
    messagingSenderId: "972151490441",
    appId: "1:972151490441:web:c980a97fd2337fd3e20358",
    measurementId: "G-2VDTSGEFKF"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db ,storage};