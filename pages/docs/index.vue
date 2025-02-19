<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex-1 flex overflow-hidden justify-center">
            <div class="flex flex-col max-w-[1000px] w-[1000px] overflow-auto">
                <div class="flex gap-5">
                    <NuxtLink :to=routesStore.routes[0][1].children[1].to class="relative flex-1 flex flex-col bg-[var(--ui-bg-elevated)] rounded-[calc(var(--ui-radius)*2)] gap-5 p-6 cursor-pointer">
                        <UIcon name="i-heroicons-arrow-up-right" size="24" class="absolute left-full -translate-full -ml-5 mt-5" />

                        <UIcon :name=routesStore.routes[0][1].icon size="40" class="text-[var(--ui-primary)]" />
                        <p class="text-xl font-medium"> {{ routesStore.routes[0][1].children[1].label }} </p>
                    </NuxtLink>

                    <NuxtLink :to=routesStore.routes[0][1].children[2].to class="relative flex-1 flex flex-col bg-[var(--ui-bg-elevated)] rounded-[calc(var(--ui-radius)*2)] gap-5 p-6 cursor-pointer">
                        <UIcon name="i-heroicons-arrow-up-right" size="24" class="absolute left-full -translate-full -ml-5 mt-5" />

                        <UIcon :name=routesStore.routes[0][1].icon size="40" class="text-[var(--ui-primary)]" />
                        <p class="text-xl font-medium"> {{ routesStore.routes[0][1].children[2].label }} </p>
                    </NuxtLink>
                </div>
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
    

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][1]]);
</script>