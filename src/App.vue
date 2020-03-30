<template>
    <div id="app">
        <md-app md-mode="reveal">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">טהרת המשפחה</span>
            </md-app-toolbar>
            <md-app-drawer :md-active.sync="menuVisible" class="format-menu">
            <NavBar></NavBar>
            </md-app-drawer>
            <md-app-content>
                <router-view id="router"/>
                <div id="update-available" v-if="updateExists">
                    <button @click="refreshApp">עידכון זמין - לחצי כאן בשביל לעדכן!</button>
                </div>
            </md-app-content>
        </md-app>
        <footerComp></footerComp>
    </div>
</template>


<script>
    export default {
        name: 'app',
        components: {
            NavBar: () => import("./components/NavBar"),
            footerComp: () => import("./components/Footer.vue")
        },
        data: () => ({
            menuVisible: false,
            user: window.user,
            refreshing: false,
            registration: null,
            updateExists: false,
        }),
        watch: {
            '$route'() {
                this.menuVisible = false;
            },
        },
        methods: {
            refreshApp(){
                this.updateExists = false;
                if (!this.registration || !this.registration.waiting) { return; }
                this.registration.waiting.postMessage('skipWaiting');
            },
            showRefreshUI (e) {
                this.registration = e.detail;
                this.updateExists = true;
            },
        },
        created () {
            document.addEventListener(
                'swUpdated', this.showRefreshUI, { once: true }
            );
            navigator.serviceWorker.addEventListener(
                'controllerchange', () => {
                    if (this.refreshing) return;
                    this.refreshing = true;
                    window.location.reload();
                }
            );
        },
    };
</script>

<style lang="scss">
    @import "~vue-material/dist/theme/engine";

    @include md-register-theme("default", (
            primary: #f54291,
            accent: #ff78ae
    ));
    @import "~vue-material/dist/theme/all";
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        /*src: url(MaterialIcons-Regular.eot); !* For IE6-8 *!*/
        src: local('Material Icons'),
        local('MaterialIcons-Regular'),
        url(./assets/icons/MaterialIcons-Regular.woff2) format('woff2'),
        url(./assets/icons/MaterialIcons-Regular.woff) format('woff'),
        url(./assets/icons/MaterialIcons-Regular.ttf) format('truetype');
    }
    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;  /* Preferred icon size */
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        /* Support for all WebKit browsers. */
        -webkit-font-smoothing: antialiased;
        /* Support for Safari and Chrome. */
        text-rendering: optimizeLegibility;
        /* Support for Firefox. */
        -moz-osx-font-smoothing: grayscale;
        /* Support for IE. */
        font-feature-settings: 'liga';
    }
    * {
        direction: rtl;
        font-family: 'Roboto', sans-serif;;
        box-sizing: border-box;
    }
    :root {
        font-size: 62.5%;
    }
    html, body, #app, .md-app {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
    .md-ripple {
        justify-content: center;
    }
    .format-menu {
        left: unset;
        transform: translate3D(100%, 0, 0);
    }
    .md-icon-right {
        margin-right: 0 !important;
        margin-left: 1.5rem !important;
    }
    .md-list-item-text {
        text-align: right;
        a, span {
            color: black !important;
        }
    }
    .toasted {
        justify-content: space-evenly!important;
        text-align: center;
    }
    .action {
        color: #fff !important;
        font-size: 1.5rem !important;
        text-decoration: underline !important;
    }
    .pinkBack{
        background-color: #ff78ae!important;
    }
    .md-card-header {
        text-align: center;
    }
    input {
        height: 6vh;
        padding-right: 1rem;
        padding-left: 1.5rem;
    }
    form {
        text-align: center;
    }
    input {
        border-radius: 1rem;
        border: solid .1rem #323232;
    }
    input:focus {
        outline: none !important;
        border-color: #323232;
    }
    .md-radio-container {
        margin-left: 5px;
    }
    #loader{
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #update-available{
        position: fixed;
        bottom: 0;
        margin-bottom: 10rem;
        button{
            margin-top: .7rem;
            margin-bottom: .7rem;
            width: 22rem;
            height: 3.5rem;
            background-color: #f54291;
            border-radius: 0.25rem;
            font-size: 1.16rem;
            color: #fff;
            line-height: 1.25;
            border: none;
        }
    }
    /*.md-input, .md-field .md-textarea {*/
    /*    height: unset !important;*/
    /*}*/
</style>