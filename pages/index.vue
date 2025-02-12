<template>
    <div class="flex-1 flex flex-col">
        <!-- <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex-1 flex overflow-hidden justify-center">
            <div class="flex max-w-[900px] overflow-auto">
                <nuxt-content :document="post" />
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
    // const { data: post } = await useAsyncData("test", () => $fetch("https://raw.githubusercontent.com/IOT-Project-EI4/resources-and-management/main/README.md"));

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][0]]);
</script>

<style scoped>

</style>