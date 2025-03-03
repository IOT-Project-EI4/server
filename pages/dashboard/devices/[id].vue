<template>
    <div class="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pr-3">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex-1 flex flex-col gap-3">
            <div v-if="dataStatus == 'error'">
                <p class="text-red-500"> Device not found </p>
            </div>

            <div v-else-if="dataStatus == 'idle' || dataStatus == 'pending'" v-for="index in 2" class="flex gap-3" :class="{ 'flex-row-reverse': index % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }">
                <USkeleton class="flex-1 h-[320px]" />
                <USkeleton class="bg-[var(--ui-bg-elevated)] h-[320px] w-[342px]" />
            </div>

            <!-- :class="{ 'flex-row-reverse': unit.id % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }" -->
            <div v-else v-for="sensor, sensorIndex in deviceData.sensors" :key="sensor.id" class="flex flex-col">
                <div v-for="unit, unitIndex in sensor.units" :key="unit.id" class="flex-1 flex flex-col gap-3 pb-2 overflow-x-auto">
                    <Line class="flex-1 min-w-[700px]" :id=unit.id :data="data[sensorIndex][unitIndex]" :labels="labels[sensorIndex][unitIndex]" :title="`${sensor.name} - ${unit.name}`" :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                </div>

                <!-- <Line class="flex-1" :id=unit.id :data="data[index]" :labels="labels[index]" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                <Doughnut class="bg-[var(--ui-bg-elevated)]" :id=unit.id :value=unit.latestData.value :targetValue="25" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Line from "@/components/ui/charts/line.vue";
    import Doughnut from "~/components/ui/charts/doughnut.vue";

    import { SERVER_URL } from "~/constants/server";
    
    import { useDevicesStore } from '~/stores/devices';
    import { useDisplayStore } from "~/stores/display";

    definePageMeta({
        validate: async (route) => {
            if(typeof route.params.id == 'object') route.params.id = route.params.id[0];
            return typeof parseInt(route.params.id) == 'number' && !isNaN(parseInt(route.params.id));
        }
    });

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);

    const deviceId: number = useRoute().params.id as any;

    const deviceStore = useDevicesStore();
    const { devices, devicesStatus } = storeToRefs(deviceStore);

    const device: any = ref(null);

    const { data : deviceData, status : dataStatus, refresh: dataRefresh } = useLazyAsyncData('deviceData', async () => {
        let response : any = await $fetch(SERVER_URL + "client/get-device-data-history", {
            query: { device_id: device.value.id },
        });

        return JSON.parse(response);
    }, {
        watch: [device],
        immediate: false,
    });

    watchEffect(() => {
        // Check if device id is in devices
        if(devicesStatus.value == 'idle' || devicesStatus.value == 'pending' || devicesStatus.value == 'error') return;
        else {
            let deviceObject = devices.value.find((device: any) => device.id == deviceId);

            if(deviceObject == undefined) device.value = null;
            else device.value = deviceObject;
        }
    });

    const labels: Ref<string[][][]> = ref([]);
    const data: Ref<number[][][]> = ref([]);

    watchEffect(() => {
        if(dataStatus.value == 'idle' || dataStatus.value == 'pending' || dataStatus.value == 'error') return;
        else {
            let dataHistory: number[][][] = [];
            let dataLabels: string[][][] = [];

            for(const sensor of deviceData.value.sensors) {
                let sensorData: number[][] = [];
                let sensorLabels: string[][] = [];

                for(const unit of sensor.units) {
                    let unitData: number[] = [];
                    let unitLabels: string[] = [];

                    for(const data of unit.latestData) {
                        unitData.push(data.value);

                        // Format date
                        const date = new Date(data.created_at);

                        const formattedDate = date.toLocaleDateString('fr-FR', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        });
                        unitLabels.push(formattedDate);
                    }

                    sensorData.push(unitData);
                    sensorLabels.push(unitLabels);
                }

                dataHistory.push(sensorData);
                dataLabels.push(sensorLabels);
            }
            
            labels.value = dataLabels;
            data.value = dataHistory;
        }
    });

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][1], {
        label: "Device infos",
        to: "/dashboard/devices/" + deviceId,
        icon: 'i-ion-server-outline',
    }, {
        label: device.value?.name || "Unknown Device",
        to: "/dashboard/devices/" + deviceId,
        icon: 'i-ion-hardware-chip-outline',
    }]);
</script>