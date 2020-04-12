import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './firebaseConfig'
import 'firebase/functions';


const firebaseConfig = config;

firebase.initializeApp(firebaseConfig);

const functions = firebase.functions();

export default {
    firebase,
    functions
}