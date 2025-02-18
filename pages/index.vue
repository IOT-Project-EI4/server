<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />
        
        <div class="flex-1 flex overflow-hidden justify-center">
            <div class="flex max-w-[1000px] overflow-auto">
                <p> home </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][0]]);
</script>