<template>
    <div class="container">
        <div class="header">
        <h1>בחירת תזכורות</h1>
        <span>התזכורות נשלחות באופן אוטומטי בתאריך הפרישה שלוש שעות לפניו. אם הפרישה בלילה, התזכורת תשלח 3 שעות לפני, ואם ביום, היא תשלח בשעה 7 בבוקר.</span>
        </div>
        <div class="reminders-container">
            <md-switch class="switch" v-model="prishaDatesReminder" @change="notificationsOn"><span>תזכורת לתאריכי פרישה</span></md-switch>
            <md-switch class="switch " v-model="sevenCleanDaysReminder" disabled><span>תזכורת לשבעה נקיים (בקרוב...)</span></md-switch>
            <md-switch class="switch " v-model="biotzReminedr"  disabled><span>תזכורת לתאריך הביוץ (בקרוב...)</span></md-switch>
        </div>
    </div>
</template>

<script>
    import messaging from '../firebase/firebase';

export default {
    data: () => ({
        prishaDatesReminder: false,
        sevenCleanDaysReminder: false,
        biotzReminedr: false
    }),
    methods: {
        notificationsOn() {
            messaging.requestPermission();
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