<template>
    <div>
        <md-toolbar class="md-transparent" md-elevation="0">תפריט</md-toolbar>
        <md-list class="ul-menu">
            <md-list-item to="/home" v-if="user">
                <md-icon class="md-icon-right">done</md-icon>
                <span class="md-list-item-text">ראשי</span>
            </md-list-item>
            <md-list-item to="/Dates" v-if="user">
                <md-icon class="md-icon-right">date_range</md-icon>
                <span class="md-list-item-text">תאריכים</span>
            </md-list-item>
            <md-list-item to="/Reminders" v-if="user" :disabled="true">
                <md-icon class="md-icon-right">alarm</md-icon>
                <span class="md-list-item-text">תזכורות</span>
            </md-list-item>
            <md-list-item v-if="user" :disabled="true">
                <md-icon class="md-icon-right">assignment</md-icon>
                <span class="md-list-item-text">מחשבון ביוץ</span>
            </md-list-item>
            <md-list-item v-if="user" :disabled="true">
                <md-icon class="md-icon-right">insert_comment</md-icon>
                <span class="md-list-item-text">מדריך</span>
            </md-list-item>
            <md-list-item v-if="user" to="/settings">
                <md-icon class="md-icon-right">account_box</md-icon>
                <span class="md-list-item-text">הגדרות</span>
            </md-list-item>
            <md-list-item @click="showDialog = true" v-if="user">
                <md-icon class="md-icon-right">exit_to_app</md-icon>
                <span class="md-list-item-text">התנתקי</span>
            </md-list-item>
            <md-list-item to="/login" v-if="!user">
                <md-icon class="md-icon-right">account_circle</md-icon>
                <span class="md-list-item-text">התחברות</span>
            </md-list-item>
            <md-list-item to="/sign-up" v-if="!user">
                <md-icon class="md-icon-right">person_add</md-icon>
                <span class="md-list-item-text">הרשמה</span>
            </md-list-item>
        </md-list>
        <div>
            <md-dialog-confirm
                    :md-active.sync="showDialog"
                    md-title="האם ברצונך להתנתק?"
                    md-confirm-text="כן"
                    md-cancel-text="לא"
                    @md-confirm="logout"
                    @md-cancel="onCancel"/>
        </div>
    </div>
</template>

<script>
    import fireBaseInstance from "../firebase/firebase";

    export default {
        name: "NavBar",
        data: () => ({
            user: window.user,
            showDialog: false
        }),
        methods: {
            onCancel() {
                this.showDialog = false;
            },
            logout() {
                self = this;
                fireBaseInstance.firebase.auth().signOut()
                    .then(() => {
                        this.$router.push('/login');
                    }).catch(function (error) {
                    self.$toasted.global.err({
                        message: 'בעייה התרחשה, אנא נסי שוב.',
                    });
                });
            },
        }
    };
</script>

<style scoped>

</style>