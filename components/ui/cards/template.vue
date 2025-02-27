<template>
    <div class="relative flex rounded-2xl overflow-hidden backdrop-blur-md" :class="{ 'p-4': showDesktop, 'p-3' : !showDesktop, 'min-w-[350px]': showDesktop && margin, 'min-w-[320px]': !showDesktop && margin }">
        <div class="absolute w-full h-full bg-[var(--ui-bg)]" :style="{ 'opacity': transparency }" :class="{ '-mt-4 -ml-4': showDesktop, '-mt-3 -ml-3' : !showDesktop }"></div>

        <div class="z-10 flex-1 flex overflow-hidden">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        transparency: {
            type: Number,
            default: 0.5
        },

        margin: {
            type: Boolean,
            default: true
        }
    });

    import { useDisplayStore } from '~/stores/display';

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);
</script>