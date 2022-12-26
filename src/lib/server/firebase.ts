// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAQ4MfC7d_l39QfV40CkvsR-EGgaXAnCXk',
	authDomain: 'bb-bob.firebaseapp.com',
	projectId: 'bb-bob',
	storageBucket: 'bb-bob.appspot.com',
	messagingSenderId: '470475689347',
	appId: '1:470475689347:web:45c145f0ac40e0e142fab6',
	measurementId: 'G-RJP2WLK30T'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

console.log('analytics:', analytics);
console.log('firestore:', firestore);
