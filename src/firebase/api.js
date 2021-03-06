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


export default {
    updateData,
    updateArrayData,
    getData,
    patchLastArrayData,
};
