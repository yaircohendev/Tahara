<template>
    <div id="form">
        <md-card class="form">
            <md-card-header>
                <div class="md-title headline">שכחתי סיסמה</div>
            </md-card-header>
            <md-card-content>
                <form @submit.prevent="forgotPass">
                    <md-field>
                        <md-input v-model="email" placeholder="אימייל" style="direction: ltr"></md-input>
                    </md-field>
                    <md-button type="submit" class="md-raised md-primary">אישור</md-button>
                </form>
            </md-card-content>
            <md-card-actions>
                <md-button to="/sign-up">הרשמה עם אימייל</md-button>
                <md-button to="/forgot">שכחתי סיסמה</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    import fireBaseInstance from "../firebase/firebase";

    export default {
        name: "Forgot",
        data: () => ({
            email: ''
        }),
        methods: {
            forgotPass(){
                const self = this;
                fireBaseInstance.firebase.auth().sendPasswordResetEmail(this.email)
                    .then(function() {
                        return self.$toasted.global.success({
                            message: 'איימיל נשלח',
                        });
                }).catch(function(error) {
                    return self.$toasted.global.err({
                        message:  'שגיאה התרחשה!' + ' ' + error,
                    });
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-input {
        text-align: center;
    }
</style>