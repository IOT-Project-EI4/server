<template>
    <div class="absolute h-full w-full">
        <NuxtRouteAnnouncer />
        
        <UApp>
            <NuxtLayout class="absolute w-full h-full">
                <NuxtPage />
            </NuxtLayout>
        </UApp>
    </div>
</template>