import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyB4AfMey5q1B72SdTCoGt_c-QaXXstGJsM",
  authDomain: "chatly-f9f6a.firebaseapp.com",
  projectId: "chatly-f9f6a",
  storageBucket: "chatly-f9f6a.appspot.com",
  messagingSenderId: "550683959515",
  appId: "1:550683959515:web:9ece5bac13b92e67366cfe",
  measurementId: "G-GQXJ9516RR"
};
const app = initializeApp(firebaseConfig);
export const chatImage = getStorage(app);