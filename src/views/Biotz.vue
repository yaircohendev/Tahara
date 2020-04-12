<template>
    <div>
        <h1>ביוץ מוערך</h1>
        <p>שימי לב: ניתן להעריך את ימי הביוץ רק במידה שהמחזור החודשי סדיר</p>
        <md-switch class="switch" v-model="confirmToggle" ><span>כן, יש לי מחזור סדיר</span></md-switch>
    </div>
</template>

<script>
    export default {
        name: "Biotz",
        data: () => ({
            confirmToggle: false
        })
    };
</script>

<style scoped>
    h1, p {
        text-align: center;
    }
    span{
        margin-right: 1rem;
    }
</style>
<style>
    .md-switch-container{
        direction: ltr;
    }
</style>