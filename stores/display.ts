import { defineStore } from 'pinia';

export const useDisplayStore = defineStore('display', () => {
    const { isDesktop } = useDevice();

    const screnWidth = ref(0);
    const showDesktop = computed(() => {
        return (isDesktop && screnWidth.value == 0) || screnWidth.value > 1200;
    });

    onMounted(() => {
        screnWidth.value = window.innerWidth;
        window.addEventListener('resize', resize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', resize);
    });

    function resize() {
        screnWidth.value = window.innerWidth;
    }

    return { showDesktop }
});