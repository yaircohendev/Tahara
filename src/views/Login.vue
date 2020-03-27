<template>
    <div id="form">
        <md-card class="form">
            <md-card-header>
                <div class="md-title headline">התחברות</div>
            </md-card-header>
            <md-card-content>
                <form @submit.prevent="signIn">
                    <md-field>
                        <md-input v-model="email" placeholder="אימייל" style="direction: ltr"></md-input>
                    </md-field>
                    <md-field>
                        <md-input style="direction: ltr" type="password" autocomplete="on" v-model="password" placeholder="סיסמה"></md-input>
                    </md-field>
                    <md-button type="submit" class="md-raised md-primary">התחברות</md-button>
                </form>
            </md-card-content>
            <md-card-actions>
                <md-button to="/sign-up">הרשמה עם אימייל</md-button>
                <md-button to="/forgot">שחכתי סיסמה</md-button>
            </md-card-actions>
        </md-card>
        <loader v-if="loader"></loader>
    </div>
</template>

<script>
    import fireBaseInstance from "../firebase/firebase";

    export default {
        name: "Login",
        data: () => ({
            email: '',
            password: '',
            loader: undefined
        }),
        components: {
            loader: () => import('../components/Loader')
        },
        methods: {
            signIn: function () {
                this.loader = true;
                const self = this;
                fireBaseInstance.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then(() => {
                        self.loader = false;
                        self.$toasted.global.success({
                            message: 'התחברת בהצלחה!',
                        });
                        self.$router.push('/home');
                    })
                    .catch((error) => {
                        self.loader = false;
                        self.$toasted.global.err({
                            message: error
                        });
                    });
            },
        },
    };
</script>

<style scoped lang="scss">
    .md-input {
        text-align: center;
    }
</style>