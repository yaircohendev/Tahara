import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging'
import config from './firebaseConfig'
import api from "./api";

const firebaseConfig = config;

firebase.initializeApp(firebaseConfig);

// To put later in its own file

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BKSfdq9yXPWUxq7N4z9ERe3IaHXQyXLQA7wiR9f63jzOX2WQbaGSZGDKNLonHywUIsbb3osylFOaKb7BEsf2RgU');

function requestPermission(){
    messaging.getToken().then(async (currentToken) => {
        if (currentToken) {
            await api.updateData(currentToken, 'messagingToken')
        } else {
            console.log('No Instance ID token available. Request permission to generate one.');
            // setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // showToken('Error retrieving Instance ID token. ', err);
        // setTokenSentToServer(false);
    });
}

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then(async (refreshedToken) => {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false);
        // // Send Instance ID token to app server.
        await api.updateData(refreshedToken, 'messagingToken')
        // ...
    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        // showToken('Unable to retrieve refreshed token ', err);
    });
});


export default {
    firebase,
    requestPermission
}