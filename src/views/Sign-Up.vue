<template>
    <div id="form">
        <md-card>
            <md-card-header>
                <div class="md-title headline">הרשמה</div>
            </md-card-header>
            <md-card-content>
                <form @submit.prevent="signUp">
                    <md-field>
                        <md-input v-model="email" placeholder="אימייל" style="direction: ltr"></md-input>
                    </md-field>
                    <md-field>
                        <md-input type="password" v-model="password" placeholder="סיסמה"></md-input>
                    </md-field>
                    <md-field>
                        <md-input type="password" v-model="confirmPassword" placeholder="אישור סיסמה"></md-input>
                    </md-field>
                    <md-button v-if="!registering" type="submit" class="md-raised md-primary">הרשמה</md-button>
                    <loader v-if="registering"></loader>
                </form>
            </md-card-content>
            <md-card-actions>
                <md-button to="/login">התחברות</md-button>
            </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    import fireBaseInstance from '../firebase/firebase';

    export default {
        name: "Sign-Up",
        data() {
            return {
                email: '',
                password: '',
                confirmPassword: '',
                registering: null
            };
        },
        methods: {
            errorMsg(message) {
                this.$toasted.global.err({
                    message: message,
                });
            },
            signUp: function () {
                const self = this;
                if (this.password.length < 5) return this.errorMsg('סיסמה קצרה מדי');
                if (this.password != this.confirmPassword) return this.errorMsg('סיסמה לא תואמת');
                this.registering = true;
                fireBaseInstance.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(() => {
                        self.registering = null;
                        this.$router.push('/home');
                    })
                    .catch(function (error) {
                        self.registering = null;
                        self.errorMsg(error);
                    });
            }
        },
        components: {
            loader: () => import('../components/Loader')
        }
    };
</script>

<style scoped lang="scss">
    .md-input {
        text-align: center;
    }
</style>