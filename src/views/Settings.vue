<template>
    <div>
        <div id="settings" >
            <div id="container">
                <DatePicker></DatePicker>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Settings",
        data: () => ({
            hasData: false,
        }),
        components: {
            DatePicker: () => import('../components/DatePicker'),
        }
    };
</script>

<style lang="scss" scoped>
    #container {
        width: 80%;
        margin: 0 auto;
    }
</style>