<template>
    <div class="absolute h-full w-full">
        <NuxtRouteAnnouncer />
        
        <UApp>
            <NuxtLayout class="absolute w-full h-full">
                <NuxtPage :key="$route.fullPath" />
            </NuxtLayout>
        </UApp>
    </div>
</template>