<template>
    <div class="flex flex-col p-4">
        <NuxtLink to="/" class="flex cursor-pointer">
            <div class="flex-1 flex gap-3 items-center">
                <img src="/logo.webp" class="w-12 h-12 md:h-14 md:w-14 rounded-ui" />
                <h2 class="font-medium text-2xl" :class="{ 'text-center': !useMobile }"> Smart farming </h2>
            </div>

            <UButton v-if="useMobile" size="xl" label="Close" icon="i-heroicons-x-mark" color="neutral" variant="outline" @click="$emit('closeMenu')" />
        </NuxtLink>

        <USeparator class="mt-5 mb-5" color="neutral" />

        <NuxtLink to="/docs" class="p-3 flex items-center bg-elevated rounded-ui-double cursor-pointer">
            <div class="p-2 rounded-sm bg-accented">
                <UIcon name="i-ion-file-tray-full-outline" size="30" class="bg-text -mb-2" />
            </div>
            
            <p class="flex-1 text-center text-ui font-medium"> Project documentation </p>
        </NuxtLink>

        <p class="mt-5 font-medium"> Menu : </p>

        <UNavigationMenu orientation="vertical" :items="routes" class="mt-1" />
        
        <div class="flex-1"></div>

        <USeparator class="mt-5 mb-5" color="neutral" />

        <UAvatarGroup class="ml-3" size="lg">
            <a href="https://github.com/valentin-llv" target="_blank"> <UAvatar src="https://github.com/valentin-llv.png" alt="Valentin Le Lièvre" /> </a>
            <UAvatar src="https://github.com/jjdag.png" alt="Romain Hamel" />
            <UAvatar src="https://github.com/lagejo.png" alt="Neil Richter" />
            <UAvatar src="https://github.com/inessa-kch.png" alt="Neil Richter" />
        </UAvatarGroup>

        <UNavigationMenu orientation="vertical" :items="bottomMenu" class="mt-3" />
    </div>
</template>

<script setup lang="ts">
    defineProps({
        useMobile: {
            type: Boolean,
            required: true
        }
    });

    const routes = ref(useRoutesStore().routes);
    const bottomMenu = ref([
        [
            {
                label: 'GitHub',
                icon: 'i-ion-logo-github',
                to: 'https://github.com/orgs/IOT-Project-EI4/repositories',
                target: '_blank'
            }
        ]
    ]);
</script>