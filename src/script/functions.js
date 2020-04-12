const Hebcal = require('hebcal');
import api from '../firebase/api';
import functions from '../firebase/firebase';


async function schedulePushNotifications() { // Sets correct reminder time depending on the ona and schedules the reminders.
    let data = await api.getData(),
        in30En = new Hebcal.HDate(data.in30Ona).greg(),
        inMonthEn = new Hebcal.HDate(data.hebMonthOna).greg(),
        haflagaEn = new Hebcal.HDate(data.haflagaHeb).greg();

    if (data.lastOna === 'day') {
        in30En.setHours(7, 0, 0);
        inMonthEn.setHours(7, 0, 0);
        haflagaEn.setHours(7, 0, 0);
    } else {
        in30En.setHours(17, 0, 0);
        inMonthEn.setHours(17, 0, 0);
        haflagaEn.setHours(17, 0, 0);
    }
    await api.updateNotificationStatus({
        in30Reminder: {
            in30En: `${in30En}`,
            isScheduled: false,
        },
        inMonthReminder: {
            inMonthEn: `${inMonthEn}`,
            isScheduled: false
        },
        haflagaReminder: {
            haflagaEn: `${haflagaEn}`,
            isScheduled: false
        }
    })
}



export default {
    schedulePushNotifications
};