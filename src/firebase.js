import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAOPFXUwdayzAcM4iHFXjzKZ9zMAdYrScQ",
    authDomain: "auth-development-todo.firebaseapp.com",
    projectId: "auth-development-todo",
    storageBucket: "auth-development-todo.appspot.com",
    messagingSenderId: "644805310054",
    appId: "1:644805310054:web:bef2261d417cb09f599fa7"
})

export const auth = app.auth();
export const firestore = firebase.firestore();
export default app;