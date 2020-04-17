<template>
    <div id="footer">
        <md-bottom-bar md-sync-route>
            <md-bottom-bar-item  v-if="!user" to="/login" exact md-label="התחברות" md-icon="check_circle"></md-bottom-bar-item>
                <md-bottom-bar-item  v-if="!user"  to="/sign-up" exact md-label="הרשמה" md-icon="check_circle"></md-bottom-bar-item>
            <md-bottom-bar-item  v-if="user"  to="/home" exact md-label="ראשי" md-icon="check_circle"></md-bottom-bar-item>
            <md-bottom-bar-item  v-if="user"  to="/dates" md-label="תאריכים" md-icon="date_range"></md-bottom-bar-item>
            <md-bottom-bar-item v-if="user"  to="/reminders" md-label="תזכורות" md-icon="alarm_on"></md-bottom-bar-item>
        </md-bottom-bar>
    </div>
</template>

<script>
    export default {
        name: "footerComp",
        data: () => ({
            user: window.user
        })
    };
</script>

<style lang="scss" scoped>
    #footer{
        position: fixed;
        width: 100%;
        bottom: 0;
    }
</style>
