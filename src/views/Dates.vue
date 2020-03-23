<template>
    <div>
        <div id="loader">
            <Loader v-if="!hasData"></Loader>
        </div>
        <div id="dates" v-if="hasData">
            <h2 style="text-align: center; margin-top: 5px;">תאריכי הפרישה שלך</h2>
            <div id="lastDates">
                <p>תאריך הוסת האחרון שלך: {{lastDate}} ({{lastDateEn}})</p>
                <p>תאריך הוסת לפני אחרון: {{beforeLastDate}} ({{beforeLastDateEn}})</p>
                <p>הפרש בין וסתות: {{diffInDays}} ימים</p>
            </div>
            <p class="no-margin">תאריך הפרישה הוא ב{{onaHe}}</p>
            <div id="benonit">
                <span>עונה בינונית</span>
                <p v-if="switchStatus">{{in30DateHeb}}</p>
                <p v-if="in30DateHeb != 'תאריך אינו זמין'">{{in30DateEn}}</p>
            </div>
            <div id="month">
                <span>עונת החודש</span>
                <p v-if="switchStatus">{{monthOnaHeb}}</p>
                <p v-if="monthOnaHeb != 'תאריך אינו זמין'">{{monthOnaEn}}</p>
            </div>
            <div id="haflaga">
                <span>עונת ההפלגה</span>
                <p v-if="switchStatus">{{haflagaHeb}}</p>
                <p v-if="haflagaHeb != 'תאריך אינו זמין'">{{haflagaEn}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../firebase/api';
    import script from '../script/calculations';

    const Hebcal = require('hebcal');

    export default {
        data: () => ({
            switchStatus: true,
            hebDate: true,
            onaHe: '',
            monthOna: '',
            haflagaEn: 'תאריך אינו זמין',
            in30DateHeb: 'תאריך אינו זמין',
            in30DateEn: 'תאריך אינו זמין',
            monthOnaHeb: 'תאריך אינו זמין',
            monthOnaEn: 'תאריך אינו זמין',
            haflagaHeb: 'תאריך אינו זמין',
            diffInDays: 'לא זמין',
            lastDate: 'תאריך אינו זמין',
            lastDateEn: 'תאריך אינו זמין',
            beforeLastDate: 'תאריך אינו זמין',
            beforeLastDateEn: 'תאריך אינו זמין',
            loading: false,
            hasData: false
        }),
        methods: {
            englishToHeb: function (date) {
                const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
                const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',];
                const enDate = script.enConvert(date);
                const day = days[enDate.getDay()];
                const month = months[enDate.getMonth()];
                const dateDay = enDate.getDate();
                const dateYear = enDate.getFullYear();
                const result = day + ' ' + dateDay + ' ב' + month + ' ' + dateYear;
                return result;
            },
            enConvert(date){
                return script.enConvert(date);
            }
        },
        created() {
            api.getData()
                .then(response => {
                    if (response.lastPeriods) {
                        if (response.lastPeriods.length >= 1) {
                            const lastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 1]);
                            this.lastDate = lastDate.toString('h');
                            this.lastDateEn = this.englishToHeb(this.lastDate);
                        }
                        if (response.lastPeriods.length > 1) {
                            this.beforeLastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 2])
                                .toString('h');
                            this.diffInDays = response.diffInDays;
                            this.beforeLastDateEn = this.englishToHeb(this.beforeLastDate);
                        }
                    }
                    if (response.in30Ona) {
                        this.in30DateHeb = response.in30Ona;
                        this.in30DateEn = this.englishToHeb(this.in30DateHeb);
                    }
                    if (response.hebMonthOna) {
                        this.monthOnaHeb = response.hebMonthOna;
                        this.monthOnaEn = this.englishToHeb(this.monthOnaHeb);
                    }
                    if (response.haflagaHeb) {
                        this.haflagaHeb = response.haflagaHeb;
                        this.haflagaEn = this.englishToHeb(this.haflagaHeb);
                    }
                    if (response.lastOna) {
                        const thisOna = response.lastOna[response.lastOna.length - 1];
                        thisOna === 'day' ? this.onaHe = 'יום' : this.onaHe = 'לילה (אור ל)';
                    }
                    this.hasData = true;
                }).catch((err) => {
                alert(err);
            });
        },
        components: {
            Loader: () => import('../components/Loader')
        }
    };
</script>
<style lang="scss" scoped>
    span {
        font-weight: bold;
    }
</style>