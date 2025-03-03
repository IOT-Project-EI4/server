<template>
    <div class="relative flex overflow-hidden" :class="{ 'flex-col': !showDesktop }">
        <div class="flex" v-if=showDesktop>
            <sideBar class="w-[320px]" :useMobile=false />
            <USeparator orientation="vertical" class="duration-300 ease-in-out pt-0" :class="{ 'pt-27': ($route.path.includes('dashboard') || $route.path == '/docs')}" />
        </div>

        <topBar v-if=!showDesktop class="z-1" @open-menu="openMenu" />

        <div v-if=!showDesktop class="absolute w-full h-full flex bg-[var(--ui-bg)] z-100 duration-300 ease-in-out" :class="{ 'left-0': isMenuOpen && !showDesktop, 'left-full': !isMenuOpen || showDesktop }">
            <sideBar class="flex-1" :useMobile=true @close-menu="closeMenu();  " />
        </div>

        <div class="flex-1 flex flex-col p-3 overflow-hidden">
            <div class="flex h-0 duration-300 ease-in-out -ml-3 -mt-3 -mr-3 mb-3 overflow-hidden" :class="{ 'h-23': showDesktop && ($route.path.includes('dashboard') || $route.path == '/docs')}">
                <desktopBar />
            </div>
            
            <div class="border-t-1 -m-3 border-[var(--ui-border)] rounded-tl-2xl p-3 flex-1 flex duration-300 overflow-hidden" :class="{ 'rounded-tl-none': !(showDesktop && ($route.path.includes('dashboard') || $route.path == '/docs')) }">
                <slot class="flex flex-1 flex-col"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import sideBar from '~/components/ui/navMenu/sideBar.vue';
    import topBar from '~/components/ui/navMenu/topBar.vue';
    import desktopBar from '~/components/ui/navMenu/desktopBar.vue';
    
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