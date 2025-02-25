<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex flex-col gap-5 max-w-[360px]">
            <MeteoCard class="bg-[var(--ui-bg-elevated)]" />

            <div v-if="devices == 'loading'" v-for="index in 3">
                <USkeleton class="bg-[var(--ui-bg)] h-[320px] w-[342px] opacity-60 rounded-2xl" />
            </div>

            <div v-else-if="devices == 'error'">
                <p> Error </p>
            </div>

            <div v-else v-for="device, deviceIndex in devices" :key="device.id" class="flex flex-col gap-3">
                <div v-for="sensor, sensorIndex in device.sensors" :key="sensor.id">
                    <div v-for="unit, unitIndex in sensor.units" :key="unit.id">
                        <Doughnut class="bg-[var(--ui-bg-elevated)]" :id=unit.id :value=unit.latestData.value :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MeteoCard from '~/components/ui/cards/prebuild/meteo.vue';
    import Doughnut from "~/components/ui/charts/doughnut.vue";

    import { cfetch  } from '~/composables/general/fetch';
    import type { Loading, Error } from '~/interfaces/global';

    import { useDevicesStore } from '~/stores/devices';

    const deviceStore = useDevicesStore();
    const { devices } = storeToRefs(deviceStore);

    watchEffect(() => {
        console.log(devices.value);
    });

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][1]]);
</script>