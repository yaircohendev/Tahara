<template>
    <div>
        <div class="circle-loader">
            <div class="draw" ></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "completed",
        data: () => ({
            completed: true
        })
    };
</script>

<style lang="scss" scoped>
    * {
        text-align: center;
    }
    body {
        padding: 5em;
        text-align: center;
    }
    $brand-success: #f54291;
    $loader-size: 2em;
    $check-height: $loader-size/2;
    $check-width: $check-height/2;
    $check-left: ($loader-size/6 + $loader-size/12);
    $check-thickness: 3px;
    $check-color: $brand-success;
    .circle-loader {
        margin-bottom: $loader-size/2;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-left-color: $check-color;
        animation: loader-spin 1.2s infinite linear;
        position: relative;
        display: inline-block;
        vertical-align: top;
        border-radius: 50%;
        width: $loader-size;
        height: $loader-size;
    }
    .loadComplete {
        -webkit-animation: none;
        animation: none;
        border-color: $check-color;
        transition: border 500ms ease-out;
    }
    .checkMark {
        display: block;

    &.draw:after {
         animation-duration: 800ms;
         animation-timing-function: ease;
         animation-name: checkmark;
         transform: scaleX(-1) rotate(135deg);
     }
    &:after {
         opacity: 1;
         height: $check-height;
         width: $check-width;
         transform-origin: left top;
         border-right: $check-thickness solid $check-color;
         border-top: $check-thickness solid $check-color;
         content: '';
         left: $check-left;
         top: $check-height;
         position: absolute;
     }
    }
    @keyframes loader-spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(720deg);
        }
    }
</style>