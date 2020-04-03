<template>
    <div>
      <div id="loader"><Loader v-show="!hasData"></Loader></div>
    <div id="main-page" v-if="hasData">
        <div id="header" style="margin-top:5px;" data-v-step="0">
            <md-button v-on:click="this.showGuide" class="md-icon-button icon-new" data-v-step="4">
                <md-icon>help</md-icon>
            </md-button>
            <h1 >ברוכה הבאה {{name}}</h1>
            </div>
        <div id="check">
            <div id="radio-before" v-if="radio">
            <md-radio v-model="radio" value="day">יום</md-radio>
            <md-radio v-model="radio" value="night">לילה</md-radio>
            </div>
            <div id="radio-after" v-else>
            <md-radio v-model="radio" value="day" disabled>יום</md-radio>
            <md-radio v-model="radio" value="night" disabled>לילה</md-radio>
            </div>
        </div>
        <div id="btn" data-v-step="1" v-if="!loading">
            <md-button v-if="radio === 'default'" disabled class="md-raised md-primary got">קיבלתי וסת</md-button>
            <md-button v-if="radio == 'day' || radio == 'night'" @click="pushData" class="md-raised md-primary got">קיבלתי
                וסת
            </md-button>
            <md-button v-if="clicked" class="md-raised md-primary got">
                <md-icon class="md-size-4x ">check</md-icon>
            </md-button>
        </div>
        <div id="load"><Loader v-if="loading"></Loader></div>
        <div id="manual" data-v-step="3">
            <router-link to="/settings">
            <a>בחירת תאריך ידני</a>
            </router-link>
        </div>
        <div v-show="sentShow" id="sentences">
            <p style="text-align: center; margin-top: 10px; font-size: 15px; font-style: italic">
                {{sentences[randomSent]}}</p>
        </div>
        </div>
        <div v-show="hasData"><Tour ></Tour></div>
    </div>
</template>
<script>
    import logic from '../script/calculations';
    import Tour from '../components/Tour'
    import api from '../firebase/api';

    export default {
        name: 'Home',
        data: () => ({
            hasData: false,
            radio: 'default',
            name: '',
            sentences: [
                "“אהבה מקלקלת את השורה” (בראשית רבה נה, ח) – אדם מאוהב נוהג מעל הצפוי והמסוגלות שלו. התנהגויות חדשות וכוחות חדשים.",
                "גדול הוא השלום, שמצינו שוויתר הקדוש ברוך הוא על שמו שנכתב בקדושה שימחה על המים כדי להטיל שלום בין איש לאשתו. (מסכת דרך ארץ זוטא, יא)",
                "עליו ועל זוגתו תחיה – לעשות כל התלוי בכל אחד ואחת מהם לקרב הלבבות ולחזק השלום בית. ואם ירצו באמת – בודאי יצליחו בזה. (אגרות קודש, י'רכא, הרבי מליבאוויטש)",
            ],
            sentShow: true,
            clicked: false,
            loading: false,
            finishedTour: null,
        }),
        methods: {
            async pushData(){
                this.loading = true;
                const verifyDate = await logic.verifyDate(new Date(), this.radio); // Checks if current date already submitted
                if (!verifyDate) {
                    await logic.calculateOnPush(new Date(), this.radio);
                    this.successToast()
                    this.clicked = true;
                    this.radio = undefined;
                } else {
                    this.$toasted.global.err({
                        message: 'התאריך כבר נמצא במערכת. ניתן לשנותו בהגדרות',
                    });
                }
                this.loading = false;
            },
            successToast() {
                this.$toasted.show( 'הצלחה!', {
                    type : 'success',
                    icon : 'check_circle',
                    duration: 3000,
                    closeOnSwipe: true,
                    singleton: true,
                    className: 'pinkBack',
                    action : {
                        text : 'מעבר לתאריכים',
                        onClick : (e, toastObject) => {
                            this.$router.replace('/dates');
                            toastObject.goAway(0);
                        }
                    },
                });
            },
            showGuide(){
                this.$tours['myTour'].start()
            }
        },
        components: {
            Loader: () => import('../components/Loader'),
            Tour
        },
        computed: {
            randomSent: function () {
                return Math.floor(Math.random() * this.sentences.length);
            },
        },
         async created(){
            const data = await api.getData();
            if (data){
                if (data.finishedTour) this.finishedTour = true;
            }
            this.hasData = true;
            this.name = window.user.displayName;
         },
        updated() {
            if (!this.finishedTour && this.hasData) this.showGuide()
        }
    };
</script>

<style lang="scss" scoped>
    #main-page h1, label, #btn, #check {
        text-align: center;
    }
    #header {
        display: flex;
        justify-content: center;
    }
    #manual{
        text-align: center;
    }
    h1 {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .md-radio {
        margin-top: 0;
        margin-bottom: 0.8rem;
    }
    #check {
        margin-top: 1.5rem;
    }
    .got {
        border-radius: 50%;
        width: 23vh;
        height: 20vh;
        font-size: 1.6rem;
    }
    .green {
        background-color: green;

    }
    .icon-new {
        padding: 0;
        margin: 0;
        z-index: 0;
    }
    p {
        text-align: right;
        margin-top: 10px;
    }
</style>
