import fb from './firebase';

async function getData() {
    return fb.firebase.database().ref(`users/${window.user.uid}/data`).once('value')
        .then(res => res.val())
        .catch((err) => console.log(err));
}

async function updateData(data, ref) {
    try {
        const updateRef = fb.firebase.database().ref(`users/${window.user.uid}/data/${ref}`);
        await updateRef.set(data);
    } catch (err) {
        console.log(err);
    }
}

async function updateArrayData(data, ref) {
    try {
        const oldData = await getData();
        const updateRef = fb.firebase.database().ref(`users/${window.user.uid}/data/${ref}`);
        if (!oldData) return await updateRef.set([data]);
        if (!oldData[ref]) return await updateRef.set([data]);
        const newArr = oldData[ref].concat(data); // Update the array last date, using push-like update
        await updateRef.set(newArr);
    } catch (err) {
        console.log(err);
    }
}

async function patchLastArrayData(ref, data, location){
    try {
        const oldData = await getData();
        const arrRef = fb.firebase.database().ref(`users/${window.user.uid}/data/${ref}`);
        if (!oldData[ref]) return updateArrayData(data, ref);
        let updated = {};
        updated[oldData[ref].length - location] = data;
        if (oldData.lastPeriods.length === 1 && location === 2) updated = [data].concat(oldData.lastPeriods); // Update the array last date, using push-like update
        await arrRef.update(updated);
    } catch (e) {
        console.error(e)
    }
}

async function subscribeToNotifications(data){
    try{
        const updateRef = fb.firebase.database().ref(`notifications/${window.user.uid}`);
        await updateRef.update(data)
    } catch(err){
        console.error(err)
    }
}

async function removeFromNotifications(){
   await fb.firebase.database().ref(`notifications/${window.user.uid}`).remove();
}

async function updateNotificationStatus(data){
    try {
        const updateRef = fb.firebase.database().ref(`notifications/${window.user.uid}/`);
        await updateRef.set(data);
    } catch (err) {
        console.log(err);
    }
}

export default {
    updateData,
    updateArrayData,
    getData,
    patchLastArrayData,
    subscribeToNotifications,
    removeFromNotifications,
    updateNotificationStatus
};
