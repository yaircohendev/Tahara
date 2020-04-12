<template>
    <div class="container">
        <div class="header">
        <h1>בחירת תזכורות</h1>
        <span>התזכורות נשלחות באופן אוטומטי בתאריך הפרישה. אם תאריך הפרישה בלילה, התזכורת תשלח בשעה 17:00. אם ביום, התזכורת תשלח בשעה 7:00.</span>
        </div>
        <div class="reminders-container">
            <md-switch class="switch" v-model="prishaDatesReminder" @change="notificationsToggle"><span>תזכורת לתאריכי פרישה</span></md-switch>
            <md-switch class="switch " v-model="sevenCleanDaysReminder" disabled><span>תזכורת לשבעה נקיים (בקרוב...)</span></md-switch>
            <md-switch class="switch " v-model="biotzReminedr"  disabled><span>תזכורת לתאריך הביוץ (בקרוב...)</span></md-switch>
        </div>
    </div>
</template>

<script>
  import api from '../firebase/api'
  import functions from '../script/functions'

export default {
    data: () => ({
        prishaDatesReminder: false,
        sevenCleanDaysReminder: false,
        biotzReminedr: false,
    }),
    async mounted() {
        const data = await api.getData();
        this.prishaDatesReminder = !!data.prishaDatesReminder;
    },
    methods: {
        async notificationsToggle(e) {
            if (e) {
                await functions.schedulePushNotifications();
                await api.updateData(true, 'prishaDatesReminder')
            } else {
                await api.removeFromNotifications();
            }
            window.ob.calculateSum(e, window.user.uid); // Sets user uid as an external UID for OneSignal
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    margin: 0 auto;
    h1{
    text-align: center;
    }
    .header{
        text-align: center;
    }
    .switch{

    }
    span{
        margin-right: 1rem;
    }

}
</style>
<style>
    .md-switch-container{
        direction: ltr;
    }
</style>