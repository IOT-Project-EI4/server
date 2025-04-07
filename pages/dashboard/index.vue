<template>
    <div class="flex-1 flex flex-col pb-3 pr-3 -mr-3 overflow-auto">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex flex-wrap gap-5" :class="{ 'flex-col': !showDesktop }">
            <div class="flex-1 flex flex-col gap-5">
                <TimeCard class="bg-[var(--ui-bg-elevated)]" />
                <MeteoCard class="bg-[var(--ui-bg-elevated)]" />
            </div>

            <div class="flex-1 flex">
                <TemplateCard class="flex-1 bg-[var(--ui-bg-elevated)]">
                    <div class="flex-1 flex flex-col gap-2.5">
                        <h3 class="text-lg font-semibold"> Devices status </h3>

                        <TemplateCard class="bg-[var(--ui-bg-accented)]" :margin=false>
                            <p class="font-semibold"> Registered devices: {{ greenhouseLoadingStatus == 'success' ? registeredDevicesCount : 0 }} </p>
                        </TemplateCard>

                        <div class="flex-1 flex gap-3">
                            <TemplateCard class="flex-1 bg-[var(--ui-bg-accented)]" :margin=false>
                                <div class="flex-1 flex flex-col gap-1 justify-center items-center">
                                    <p class="font-semibold"> Online devices </p>
                                    <p class="font-semibold text-2xl"> {{ onlineDevices }} </p>
                                </div>
                            </TemplateCard>

                            <TemplateCard class="flex-1" :class="{ 'bg-[var(--ui-bg-accented)]': offlineDevices == 0, 'bg-[var(--ui-error)]': offlineDevices > 0  }" :margin=false>
                                <div class="flex-1 flex flex-col gap-1 justify-center items-center">
                                    <p class="font-semibold"> Offline devices </p>
                                    <p class="font-semibold text-2xl"> {{ offlineDevices }} </p>
                                </div>
                            </TemplateCard>
                        </div>

                        <div class="-mt-0.5 flex text-[var(--ui-text-muted)]">
                            <p class="-ml-2.5 scale-90"> Offline : lastest update > 3hrs </p>
                        </div>
                    </div>
                </TemplateCard>
            </div>

            <div class="flex-1 flex min-h-[250px]" :class="{ 'min-w-[350px]': showDesktop }">
                <div class="relative flex-1 flex rounded-2xl overflow-hidden backdrop-blur-md bg-[var(--ui-bg-elevated)]" :class="{ 'p-4': showDesktop, 'p-3' : !showDesktop }">
                    <p class="font-bold z-10 text-[var(--ui-bg)] text-xl"> Photos galery </p>
                    <!-- <img class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full" src="" /> -->
                </div>
            </div>
        </div>

        <div class="flex-1 flex flex-col gap-5 mt-5">
            <div v-if="greenhouseLoadingStatus == 'pending' || greenhouseLoadingStatus == 'idle'" v-for="index in 3">
                <USkeleton class="bg-[var(--ui-bg)] h-[320px] w-[342px] opacity-60 rounded-2xl" />
            </div>

            <div v-else-if="greenhouseLoadingStatus == 'error'">
                <p> Error </p>
            </div>

            <!-- <div v-else v-for="device, deviceIndex in devices" :key="device.id" class="flex flex-col gap-2">
                <p class="font-bold text-2xl"> {{ device.name }} </p>

                <div v-for="sensor, sensorIndex in device.sensors" :key="sensor.id" class="flex flex-row gap-2">
                    <div v-for="unit, unitIndex in sensor.units" :key="unit.id" class="flex flex-wrap gap-5 bg-red-500">
                        <NuxtLink v-for="unit, unitIndex in sensor.units" :key="unit.id" :to="`dashboard/devices/${device.id}`" class="flex">
                            <Doughnut v-if="sensor.graph_type == 'doughnut'" class="bg-[var(--ui-bg-elevated)] flex flex-1" :id=unit.id :value=unit.latestData.value :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                            <Value v-if="sensor.graph_type == 'value'" class="bg-[var(--ui-bg-elevated)] flex-1" :id=unit.id :value=unit.latestData.value :title=unit.name :unit=unit.symbol />
                        </NuxtLink>
                    </div>
                </div>
            </div> -->

            <!-- <div v-for="unit, unitIndex in units" :key="unit.id" class="flex flex-wrap gap-5 bg-red-500"> -->
                <!-- <NuxtLink v-for="unit, unitIndex in units" :key="unit.id" :to="`dashboard/devices/${device.id}`" class="flex">
                    <Doughnut v-if="sensor.graph_type == 'doughnut'" class="bg-[var(--ui-bg-elevated)] flex flex-1" :id=unit.id :value=unit.latestData.value :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                    <Value v-if="sensor.graph_type == 'value'" class="bg-[var(--ui-bg-elevated)] flex-1" :id=unit.id :value=unit.latestData.value :title=unit.name :unit=unit.symbol />
                </NuxtLink> -->
            <!-- </div> -->

            <div v-else v-for="deviceGroup, groupIndex in greenhouse?.devices_groups" :key="deviceGroup.id" class="flex flex-col gap-2">
                <p class="font-bold text-2xl"> Groupe d'appareils : {{ deviceGroup.name }} </p>

                <div class="flex flex-row flex-wrap gap-2">
                    <template v-for="device, deviceIndex in deviceGroup.devices" :key="device.id">
                        <div class="bg-[var(--ui-bg-elevated)] p-5 rounded-2xl">
                            <p class="font-bold text-2xl"> Appareil : {{ device.name }} </p>

                            <div class="flex flex-row flex-wrap gap-2 mt-5">
                                <template v-for="sensor, sensorIndex in device.sensors" :key="sensor.id">
                                    <NuxtLink v-for="unit, unitIndex in sensor.units" :key="unit.id" :to="`dashboard/devices/${device.id}#unit_${unit.id}`" class="flex flex-1">
                                        <Doughnut v-if="unit.graph_type == 'donut'" class="bg-[var(--ui-bg-elevated)] flex flex-1" :id=unit.id :value=unit.latestData?.value :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                                        <Value v-if="unit.graph_type == 'value'" class="bg-[var(--ui-bg-elevated)] flex flex-1" :id=unit.id :value=unit.latestData?.value :title=unit.name :unit=unit.symbol />
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import TimeCard from '~/components/ui/cards/prebuild/time.vue';
    import MeteoCard from '~/components/ui/cards/prebuild/meteo.vue';
    import TemplateCard from '~/components/ui/cards/template.vue';

    import Doughnut from "~/components/ui/charts/doughnut.vue";
    import Value from "~/components/ui/charts/value.vue";

    import { useGreenhouseStore } from '~/stores/greenhouse';
    import { useDisplayStore } from '~/stores/display';

    import { DEVICE_CONSIDERED_OFFLINE_AFTER } from '~/constants/greenhouse';

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);

    const registeredDevicesCount = ref(0);

    const onlineDevices = ref(0);
    const offlineDevices = ref(0);

    const greenhouseStore = useGreenhouseStore();
    const { greenhouse, greenhouseLoadingStatus } = storeToRefs(greenhouseStore);

    watchEffect(() => {
        if(greenhouseLoadingStatus.value != "idle" && greenhouseLoadingStatus.value != "pending" && greenhouseLoadingStatus.value != "error") {
            // Count online and offline devices, if latestData of all sensors are more than 3 hours ago then the device is offline
            if(greenhouse.value) greenhouse.value.devices_groups.forEach((group : any) => {
                group.devices.forEach((device : any) => {
                    let online = false;

                    device.sensors.forEach((sensor : any) => {
                        sensor.units.forEach((unit : any) => {
                            if(new Date().getTime() - new Date(unit.latestData.created_at).getTime() < DEVICE_CONSIDERED_OFFLINE_AFTER) online = true;
                        });
                    });

                    if(online) onlineDevices.value++;
                    else offlineDevices.value++;

                    registeredDevicesCount.value++;
                });
            });
        }    });
    
    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][1]]);
</script>