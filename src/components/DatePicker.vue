<template>
    <div>
        <div id="loader">
            <loader v-if="!hasData"></loader>
        </div>
        <div class="md-layout-item" v-show="hasData">
            <h1 class="settings-title">הגדרות</h1>
            <div id="hebDate">
                <md-field>
                    <md-icon>account_box</md-icon>
                    <label>שם פרטי</label>
                    <md-input v-model="name" @input="saveName" :placeholder="name"></md-input>
                </md-field>
            <div id="lastOna">
                <p class="ona-time-title">זמן העונה האחרונה</p>
                <md-radio @change="updateOna" v-model="lastOna" value="day">יום</md-radio>
                <md-radio @change="updateOna" v-model="lastOna" value="night">לילה</md-radio>
            </div>
            <div v-if="lastOna">
                <md-field>
                    <md-select placeholder="יום" v-model="day" @input="updateDates(1, 'patchLast')">
                        <md-option
                                :value="key"
                                v-for="(day, key) in dates.day"
                                :key="day"
                                v-show="key <= todayHebDay && key !== 30 && !lamedExists || lamedExists && key <= todayHebDay"
                        >
                            {{day}}
                        </md-option>
                    </md-select>
                    <md-select placeholder="חודש" v-model="month" @input="updateDates(1, 'patchLast')">
                        <md-option :value="key" v-for="(month, key) in dates.month" :key="month">{{month}}</md-option>
                    </md-select>
                    <md-select placeholder="שנה" v-model="year" @input="updateDates(1, 'patchLast')">
                        <md-option :value="key" v-for="(year, key) in dates.year" :key="year">{{year}}</md-option>
                    </md-select>
                </md-field>
            </div>
            <div v-if="day && month && year">
                <p class="ona-time-title">זמן העונה לפני אחרונה</p>
                <md-field>
                    <md-select placeholder="יום" v-model="beforeDay" @input="updateDates(2, 'patchBeforeLast')">
                        <md-option :value="key" v-for="(day, key) in dates.day" :key="day"
                          v-show="key != 30 && !lamedExists && key < lastDateDay || lamedExists">{{day}}</md-option>
                    </md-select>
                    <md-select placeholder="חודש" v-model="beforeMonth" @input="updateDates(2, 'patchBeforeLast')">
                        <md-option :value="key" v-for="(month, key) in dates.month" :key="month">{{month}}</md-option>
                    </md-select>
                    <md-select placeholder="שנה" v-model="beforeYear" @input="updateDates(2, 'patchBeforeLast')">
                        <md-option :value="key" v-for="(year, key) in dates.year" :key="year">{{year}}</md-option>
                    </md-select>
                </md-field>
            </div>
                <Loader v-if="typing"></Loader>
            </div>
        </div>
    </div>
</template>

<script>
    import Hebcal from 'hebcal';
    import savedDates from '../dates';
    import api from "../firebase/api";
    import script from '../script/calculations';
    import Loader from './Loader';

    export default {
        data: () => ({
            dates: savedDates,
            name: '',
            typing: null,
            hasData: null,
            lastDate: null,
            day: null,
            month: null,
            year: null,
            beforeDay: null,
            beforeMonth: null,
            beforeYear: null,
            enLastDate: null,
            enBeforeLastDate: null,
            lastOna: undefined,
            lamedExists: new Hebcal.Month(new Hebcal.HDate().month, new Hebcal.HDate().year).length === 29 ?
                        false : true,
            todayHebDay: new Hebcal.HDate().getDate(),
            lastDateDay: null
        }),
        components: {
            savedDates,
            Loader
        },
        methods: {
            saveName() {
                this.typing = true;
                window.user.updateProfile({
                    displayName: this.name
                }).then(() => {
                    this.typing = false;
                });
            },
            async updateOna() {
               this.loading = true;
               await api.updateData(this.lastOna, 'lastOna');
               this.loading = false;
            },
            async updateDates(location, key) {
                this.loading = true;
                let date;
                if (this.day && this.month && this.year && location === 1) {
                    date = new Hebcal.HDate(this.day, this.month, this.year);
                    if (this.lastDate !== date.toString('h')){
                    await script.calculateOnPatch(date, this.lastOna, location, key);
                    }
                    return this.loading = false;
                }
                if (this.beforeDay && this.beforeMonth && this.beforeYear && location === 2) {
                    date = new Hebcal.HDate(this.beforeDay, this.beforeMonth, this.beforeYear);
                    await script.calculateOnPatch(date, this.lastOna, location, key);
                    return this.loading = false;
                }
                this.loading = false;
            },
        },
        props: ['close'],
        created() {
            const self = this;
            api.getData()
                .then(response => {
                    this.hasData = true;
                    this.name = window.user.displayName;
                    self.$emit('hasData');
                    if (response.lastOna) {
                            response.lastOna === 'day'
                                ? this.lastOna = 'day' :
                                this.lastOna = 'night';
                    }
                    if (response.lastPeriods) {
                        if (response.lastPeriods.length >= 1) {
                            const lastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 1]);
                            this.day = lastDate.day;
                            this.month = Hebcal.HDate(lastDate).getMonthName();
                            this.year = lastDate.year;
                            this.lastDate = lastDate.toString('h');
                            this.lastDateDay = lastDate.getDate()
                            this.enLastDate = script.enConvert(lastDate);

                        }
                        if (response.lastPeriods.length > 1) {
                            const beforeLastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 2]);
                            this.beforeDay = beforeLastDate.day;
                            this.beforeMonth = Hebcal.HDate(beforeLastDate).getMonthName();
                            this.beforeYear = beforeLastDate.year;
                            this.enBeforeLastDate = script.enConvert(beforeLastDate);
                        }
                    }
                });
        },
    };
</script>

<style lang="scss" scoped>
    .ona-time-title {
        font-size: 1.4rem;
        margin-bottom: 0;
        text-align: right;
    }

    #switch-heb {
        display: flex;
    }

    #switch-en {
        display: flex;
    }

    #center {
        text-align: center;
        margin-bottom: 10px;
    }

    .close {
        opacity: 0.8;
    }

    #lastOna, #beforeLastOna {
        .md-radio {
            margin-bottom: 0;
        }
    }
</style>
<style lang="scss" scoped>
    input[placeholder] {
        margin-right: 0.6rem !important;
    }

    .radio {
        margin-bottom: 0;
    }

    .settings-title {
        text-align: center;
        font-size: 2.6rem;
        margin-top: 1.5rem;
        margin-bottom: 2rem;
    }

    .md-field label[data-v-53cc84dd] {
        font-size: 1.4rem;
    }

    label {
        font-size: 1.4rem;
        text-align: right;
    }

    .md-field label {
        left: unset;
        margin-right: 10vw;
    }

    #switch-heb {
        display: flex;
    }

    #switch-en {
        display: flex;
    }

    #container {
        width: 80%;
        margin: 0 auto;

        form {
            text-align: right;

            .md-field {
                margin-bottom: 0;
            }

            input {
                margin: 0;
            }

            input placeholder {
                text-align: right;
            }

            .btn {
                padding: 0;
            }
        }
    }

    .date-picker {
        height: 10vh;
    }

    .ona-time-title {
        font-size: 1.4rem;
        margin-bottom: 0;
        text-align: right;
    }

</style>
<style>
    .md-input, .md-field .md-textarea {
        height: unset !important;
    }
</style>