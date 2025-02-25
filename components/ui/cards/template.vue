<template>
    <div class="relative flex rounded-2xl overflow-hidden p-4 backdrop-blur-md">
        <div class="absolute w-full h-full bg-[var(--ui-bg)] -mt-4 -ml-4" :style="{ 'opacity': transparency }"></div>

        <div class="z-10 flex-1 overflow-hidden">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        transparency: {
            type: Number,
            default: 0.5
        }
    });
</script>