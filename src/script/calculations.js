const Hebcal = require('hebcal');
import api from '../firebase/api';

async function calculateOnPush(date, onaTime) {
    const data = await api.getData();
    const todayDate = await calculateTodayDate(onaTime, date);
    await calculateInMonth(todayDate);
    await calculateIn30(todayDate);
    if (data) {
        if (data.lastPeriods) {
            if (data.lastPeriods.length >= 1) {
                await calculateHaflaga(data.lastPeriods[data.lastPeriods.length - 1], todayDate);
            }
        }
    }
}

async function calculateOnPatch(date, onaTime, location, key) {
    const data = await api.getData();
    await api.patchLastArrayData('lastPeriods', date.toString('h'), location);
    if (key === 'patchLast') {
        await calculateInMonth(date);
        await calculateIn30(date);
    }
    if (data.lastPeriods) {
        if (key === 'patchBeforeLast' || data.lastPeriods.length > 1) {
            await calculateHaflaga();
        }
    }
    return true;
}

function calculateHebDateWithOna(onaTime, date) {
    let hebDate = new Hebcal.HDate(date);
    if (onaTime === 'night') {
        hebDate = new Hebcal.HDate(hebDate.day + 1, hebDate.month, hebDate.year);
    }
    return hebDate;
}

async function calculateTodayDate(onaTime, date) {
    const todayHebDate = calculateHebDateWithOna(onaTime, date);
    await api.updateArrayData(todayHebDate.toString('h'), 'lastPeriods');
    await api.updateArrayData(onaTime, 'lastOna');
    return todayHebDate;
}

async function calculateInMonth(date) { //Onat Hodesh
    let hebDate = new Hebcal.HDate(date);
    const monthLength = new Hebcal.Month(hebDate.month, hebDate.year).length;
    hebDate = new Hebcal.HDate(hebDate.day + monthLength, hebDate.month, hebDate.year);
    await api.updateData(hebDate.toString('h'), 'hebMonthOna');
}

async function calculateIn30(date) { // Ona Benonit
    let hebDate = new Hebcal.HDate(date);
    hebDate.month === 12 ?
        hebDate = new Hebcal.HDate(hebDate.day, 1, hebDate.year) :
        hebDate = new Hebcal.HDate(hebDate.day + 29, hebDate.month, hebDate.year);
    await api.updateData(hebDate.toString('h'), 'in30Ona');
}

async function calculateHaflaga(beforeDate, thisDate) {
    const data = await api.getData();
    if (!thisDate) thisDate = new Hebcal.HDate(data.lastPeriods[data.lastPeriods.length - 1]);
    beforeDate = new Hebcal.HDate(data.lastPeriods[data.lastPeriods.length - 2]);
    let diff = thisDate.abs() - beforeDate.abs();
    thisDate = new Hebcal.HDate(thisDate.abs() + diff);
    await api.updateData(thisDate.toString('h'), 'haflagaHeb');
    await api.updateData(diff, 'diffInDays');
    //make sure this works also with the 12 month, make sure it's FULLY dynamic.
}

async function verifyDate(date, onaTime) {
    const data = await api.getData();
    if (!data) return false;
    if (!data.lastPeriods) return false;
    const oldDate = data.lastPeriods[data.lastPeriods.length - 1];
    const dateToCheck = calculateHebDateWithOna(onaTime, date);
    if (oldDate === dateToCheck.toString('h') || oldDate === dateToCheck.next().toString('h')) {
        return true;
    } else {
        return false;
    }
}

function enConvert(date) {
    return new Hebcal.HDate(date).greg();
}

export default {
    calculateOnPush,
    calculateOnPatch,
    verifyDate,
    enConvert,
};

