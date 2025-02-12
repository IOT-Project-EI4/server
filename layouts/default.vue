<template>
    <div class="relative flex overflow-hidden" :class="{ 'flex-col': !showDesktop }">
        <div class="flex" v-if=showDesktop>
            <sideBar class="w-[320px]" :useMobile=false />
            <USeparator orientation="vertical" class="pb-10 pt-10" />
        </div>

        <topBar v-if=!showDesktop class="z-1" @open-menu="openMenu" />

        <div v-if=!showDesktop class="absolute w-full h-full flex bg-[var(--ui-bg)] z-100 duration-300" :class="{ 'left-0': isMenuOpen && !showDesktop, 'left-full': !isMenuOpen || showDesktop }">
            <sideBar class="flex-1" :useMobile=true @close-menu="closeMenu();  " />
        </div>

        <div class="flex-1 flex flex-col p-3 overflow-y-auto overflow-x-hidden">
            <slot class="flex flex-1 flex-col" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import sideBar from '~/components/ui/navMenu/sideBar.vue';
    import topBar from '~/components/ui/navMenu/topBar.vue';
    
    import { useDisplayStore } from '~/stores/display';

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);

    const isMenuOpen = ref(false);

    function openMenu() {
        isMenuOpen.value = true;

        history.pushState({}, "", "");
        addEventListener("popstate", closeMenu);
    }

    function closeMenu(event: PopStateEvent | false = false) {
        if(event == false) history.back();
        else {
            event.preventDefault();
            event.stopImmediatePropagation();
        }

        isMenuOpen.value = false;
        removeEventListener("popstate", closeMenu);
    }

    useRouter().beforeEach((to, from, next) => {
        if(showDesktop.value) next();
        else {
            closeMenu(new PopStateEvent('popstate')); 
            next();
        }
    });
</script>

<style scoped>

</style>