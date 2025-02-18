<template>
    <div class="relative overflow-hidden w-full flex h-20">
        <NuxtLink to="/" class="flex-1 flex gap-3 items-center ml-4">
            <img src="/logo.webp" class="w-12 h-12 md:h-14 md:w-14 rounded-ui" />
            <h2 class="font-semibold text-2xl"> Smart farming </h2>
        </NuxtLink>
        
        <div class="flex flex-col justify-center mr-4">
            <UButton size="xl" label="Menu" icon="i-heroicons-bars-3" color="neutral" variant="outline" @click="$emit('openMenu')" />
        </div>
        
        <USeparator class="absolute top-full w-full -translate-y-full" />
    </div>
</template>