<template>
    <v-tour name="myTour" :steps="steps" :callbacks="myCallbacks">
        <template slot-scope="tour">
            <transition name="fade">
                <v-step
                        v-if="tour.currentStep === index"
                        v-for="(step, index) of tour.steps"
                        :key="index"
                        :step="step"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels"
                >
                    <template v-if="tour.currentStep === 0">
                        <div slot="actions">
                            <button @click="tour.stop" class="btn btn-primary v-step__button">סיום</button>
                            <button @click="tour.nextStep" class="btn btn-primary v-step__button">צעד הבא</button>
                        </div>
                    </template>
                    <template v-if="tour.currentStep >= 1 && tour.currentStep !== 4">
                        <div slot="actions">
                            <button @click="tour.previousStep" class="btn btn-primary v-step__button">צעד קודם</button>
                            <button @click="tour.nextStep" class="btn btn-primary v-step__button">צעד הבא</button>
                        </div>
                    </template>
                    <template v-if="tour.currentStep === 4">
                        <div slot="actions">
                            <button @click="tour.previousStep" class="btn btn-primary v-step__button">צעד קודם</button>
                            <button @click="tour.stop" class="btn btn-primary v-step__button">סיום</button>
                        </div>
                    </template>
                </v-step>
            </transition>
        </template>
    </v-tour>
</template>

<script>
    import api from '../firebase/api';

    export default {
        name: "Tour",
        data: () => ({
            steps: [
                {
                    target: '[data-v-step="0"]',
                    header: {
                        title: 'זה פשוט!',
                    },
                    content: `ביום שקיבלת וסת, תבחרי את העונה שלך`
                },
                {
                    target: '[data-v-step="1"]',
                    content: 'לאחר מכן תלחצי על הכפתור, ותאריכי הפרישה שלך יתעדכנו בלשונית "תאריכים", למטה.'
                },
                {
                    target: '[data-v-step="2"]',
                    content: 'זה הכל! כל חודש את יכולה לחזור, ללחוץ ביום קבלת הוסת על הכפתור, וכל תאריכי הפרישה יהיו מחושבים בשבילך!'
                },
                {
                    target: '[data-v-step="3"]',
                    content: 'במידה ושכחת ללחוץ על הכפתור באותו יום, תמיד תוכלי להכניס תאריך ידנית',
                },
                {
                    target: '[data-v-step="4"]',
                    content: 'על מנת לחזור לסיור זה, ניתן ללחוץ על הסימן שאלה בכל זמן',
                },
            ],
            myCallbacks: {
                onStop: async function(){
                    await api.updateData(true, 'finishedTour')
                }
            },
        }),
    };
</script>

<style lang="scss">
    .v-step__button{
        font-size: 1.2rem!important;
        width: 6rem;
        height: 3rem!important;
        background-color: #f54291!important;
        border: 0px solid #323232!important;
        border-radius: 5rem!important;
        margin: .4rem!important;
    }
</style>