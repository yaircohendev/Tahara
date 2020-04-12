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
                        <md-select placeholder="יום" v-model="lastDay" @input="updateDates(1, 'patchLast')">
                            <md-option
                                    :value="key"
                                    v-for="(day, key) in dates.day"
                                    :key="day"
                                    v-show=
                                            "key > beforeLastDateDay && key <= todayHebDay && key != 30 && !lastLamedExists
                                || lastMonth !== beforeMonth && key <= todayHebDay && key != 30 && !lastLamedExists
                                || todayHebMonth !== lastMonth && key != 30 && !lastLamedExists
                                || lastLamedExists && key <= todayHebDay && todayHebMonth == lastMonth
                                || lastLamedExists && todayHebMonth != lastMonth"
                            >{{day}}
                            </md-option>
                        </md-select>
                        <md-select placeholder="חודש" v-model="lastMonth" @input="updateDates(1, 'patchLast')">
                            <md-option :value="key" v-for="(month, key) in dates.month" :key="month">{{month}}
                            </md-option>
                        </md-select>
                        <md-select placeholder="שנה" v-model="lastYear" @input="updateDates(1, 'patchLast')">
                            <md-option :value="key" v-for="(year, key) in dates.year" :key="year">{{year}}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div v-if="lastDay && lastMonth && lastYear">
                    <p class="ona-time-title">זמן העונה לפני אחרונה</p>
                    <md-field>
                        <md-select placeholder="יום" v-model="beforeDay" @input="updateDates(2, 'patchBeforeLast')">
                            <md-option :value="key" v-for="(day, key) in dates.day" :key="day"
                                       v-show=
                                               "key != 30 && !beforeLastLamedExists && key < lastDateDay
                          || lastMonth !== beforeMonth && key !=30 && !beforeLastLamedExists
                          || beforeLastLamedExists && lastMonth !== beforeMonth
                          || beforeLastLamedExists && key < lastDateDay
                            ">{{day}}
                            </md-option>
                        </md-select>
                        <md-select placeholder="חודש" v-model="beforeMonth" @input="updateDates(2, 'patchBeforeLast')">
                            <md-option :value="key" v-for="(month, key) in dates.month" :key="month">{{month}}
                            </md-option>
                        </md-select>
                        <md-select placeholder="שנה" v-model="beforeYear" @input="updateDates(2, 'patchBeforeLast')">
                            <md-option :value="key" v-for="(year, key) in dates.year" :key="year">{{year}}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <Loader v-if="loading"></Loader>
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
    import functions from "../script/functions";

    export default {
        data: () => ({
            dates: savedDates,
            name: '',
            loading: null,
            hasData: null,
            lastDate: null,
            lastDay: null,
            lastMonth: null,
            lastYear: null,
            beforeDay: null,
            beforeMonth: null,
            beforeYear: null,
            enLastDate: null,
            enBeforeLastDate: null,
            lastOna: undefined,
            lastLamedExists: null,
            beforeLastLamedExists: null,
            todayHebDay: new Hebcal.HDate().getDate(),
            todayHebMonth: null,
            lastDateDay: null,
            beforeLastDateDay: null,
        }),
        components: {
            savedDates,
            Loader
        },
        methods: {
            saveName() {
                this.loading = true;
                window.user.updateProfile({
                    displayName: this.name
                }).then(() => {
                    this.loading = false;
                });
            },
            async updateOna() {
                this.loading = true;
                await api.updateData(this.lastOna, 'lastOna');
                this.successMsg('עונה עודכנה בהצלחה');
                this.loading = false;
            },
            async updateDates(location, key) {
                this.loading = true;
                let date;
                if (this.lastDay && this.lastMonth && this.lastYear && location === 1) {
                    if (this.beforeDay && this.beforeMonth && this.beforeYear) {
                        if (!this.dateVerification()) {
                            this.loading = false;
                            return this.errorMsg('תאריך עונה אחרונה לא יכול להיות קטן יותר מעונה לפני אחרונה');
                        }
                    }
                    date = new Hebcal.HDate(this.lastDay, this.lastMonth, this.lastYear);
                    if (this.lastDate !== date.toString('h')) {
                        await script.calculateOnPatch(date, this.lastOna, location, key);
                        await functions.schedulePushNotifications();
                        this.lastDate = date.toString('h');
                        this.successMsg('תאריך עודכן בהצלחה');
                    } else if (this.lastDate == date.toString('h')) {
                        this.errorMsg('נא לבחור תאריך שונה מאותו תאריך');
                    }
                    return this.loading = false;
                }
                if (this.beforeDay && this.beforeMonth && this.beforeYear && location === 2) {
                    if (!this.dateVerification()) {
                        this.loading = false;
                        return this.errorMsg('תאריך עונה אחרונה לא יכול להיות קטן יותר מעונה לפני אחרונה');
                    }
                    date = new Hebcal.HDate(this.beforeDay, this.beforeMonth, this.beforeYear);
                    if (this.lastDate === date.toString('h')) {
                        this.loading = false;
                        return this.errorMsg('תאריך לא יכול להיות זהה');
                    }
                    this.successMsg('תאריך עודכן בהצלחה');
                    await script.calculateOnPatch(date, this.lastOna, location, key);
                    await functions.schedulePushNotifications();
                    return this.loading = false;
                }
                this.loading = false;
            },
            dateVerification() {
                const lastDate = new Hebcal.HDate(this.lastDay, this.lastMonth, this.lastYear);
                const beforeLastDate = new Hebcal.HDate(this.beforeDay, this.beforeMonth, this.beforeYear);
                return beforeLastDate.abs() <= lastDate.abs();
            },
            errorMsg(message) {
                this.$toasted.global.err({
                    message: message,
                });
            },
            successMsg(message) {
                this.$toasted.global.success({
                    message: message,
                });
            }
        },
        props: ['close'],
        created() {
            const self = this;
            api.getData()
                .then(response => {
                    this.hasData = true;
                    this.name = window.user.displayName;
                    this.todayHebMonth = new Hebcal.HDate().getMonthName();
                    self.$emit('hasData');
                    if (response) {
                        if (response.lastOna) {
                            response.lastOna === 'day'
                                ? this.lastOna = 'day' :
                                this.lastOna = 'night';
                        }
                        if (response.lastPeriods) {
                            if (response.lastPeriods.length >= 1) {
                                const lastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 1]);
                                this.lastDay = JSON.stringify(lastDate.day);
                                this.lastMonth = Hebcal.HDate(lastDate).getMonthName();
                                this.lastYear = JSON.stringify(lastDate.year);
                                this.lastDate = lastDate.toString('h');
                                this.lastDateDay = lastDate.getDate();
                                this.enLastDate = script.enConvert(lastDate);
                                this.lastLamedExists = new Hebcal.Month(this.lastMonth, JSON.parse(this.lastYear)).length !== 29;
                            }
                            if (response.lastPeriods.length > 1) {
                                const beforeLastDate = new Hebcal.HDate(response.lastPeriods[response.lastPeriods.length - 2]);
                                this.beforeDay = JSON.stringify(beforeLastDate.day);
                                this.beforeMonth = Hebcal.HDate(beforeLastDate).getMonthName();
                                this.beforeYear = JSON.stringify(beforeLastDate.year);
                                this.enBeforeLastDate = script.enConvert(beforeLastDate);
                                this.beforeLastDateDay = beforeLastDate.getDate();
                                this.beforeLastLamedExists = new Hebcal.Month(this.beforeMonth, JSON.parse(this.beforeYear)).length !== 29;
                            }
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