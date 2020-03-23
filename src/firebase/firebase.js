import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './firebaseConfig'

const firebaseConfig = config;

firebase.initializeApp(firebaseConfig);

export default {
    firebase,
}