<template>
    <div class="spinner"></div>
</template>

<style scoped>
    .spinner {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: radial-gradient(farthest-side,#05df72 94%,#0000) top/3.8px 3.8px no-repeat, conic-gradient(#0000 30%,#05df72);
        -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 3.8px),#000 0);
        animation: spinner-loader 1s infinite linear;
    }

    @keyframes spinner-loader {
        100% {
            transform: rotate(1turn);
        }
    }
</style>