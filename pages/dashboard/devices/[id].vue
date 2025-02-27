<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex flex-col gap-3">
            <!-- <div v-if="device == 'error'">
                <p class="text-red-500">Device not found</p>
            </div>

            <div v-else-if="device == 'loading' || data.length == 0" v-for="index in 2" class="flex gap-3" :class="{ 'flex-row-reverse': index % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }">
                <USkeleton class="flex-1 h-[320px]" />
                <USkeleton class="bg-[var(--ui-bg-elevated)] h-[320px] w-[342px]" />
            </div> -->

            <!-- <div v-else v-for="unit, index in device.units" :key="unit.id" class="flex gap-3" :class="{ 'flex-row-reverse': unit.id % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }">
                <Line class="flex-1" :id=unit.id :data="data[index]" :labels="labels[index]" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                <Doughnut class="bg-[var(--ui-bg-elevated)]" :id=unit.id :value=unit.latestData.value :targetValue="25" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
            </div> -->
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

    // const device: ComputedRef<any | null> = computed(() => {
    //     if(devicesStatus.value == "idle" || devicesStatus.value == "pending" || devicesStatus.value == "error") return null;
    //     else {
    //         let foundDevice = devices.value.find(device => device.id == deviceId);

    //         if(foundDevice == undefined) return null;
    //         else return foundDevice;
    //     }
    // });

    // watch(device, async (value) => {
    //     if(value != null) {
    //         for(const sensor of device.value.sensors) {
    //             const { data : sensorMeasurements, status : sensorMeasurementsStatus, refresh: sensorMeasurementsRefresh } = useLazyAsyncData<any>('sensorMeasurements', async () => {
    //                 return await $fetch(SERVER_URL + "client/get-sensor-measurements", {
    //                     query: { sensor_id: sensor.id, },
    //                 });
    //             });
    //         }
    //     }
    // });

    // const labels: Ref<string[][]> = ref([]);
    // const data: Ref<number[][]> = ref([]);

    // watchEffect(async () => {
    //     if(device.value == 'loading') return [];
    //     else if(device.value == 'error') return [];
    //     else {
    //         let dataHistory: number[][] = [];
    //         let dataLabels: string[][] = [];

    //         for(let unit of device.value.units) {
    //             let result = await deviceStore.loadDeviceDataHistory(device.value, unit);
                
    //             if(result == 'error') return [];
    //             else {
    //                 // Add data to dataHistory once for every 10 miutes using "created_at" as timestamp hour
    //                 let dataUnit: number[] = [];
    //                 let dataUnitLabels: string[] = [];
                    
    //                 for(let i = 0; i < result.length - 1; i++) {
    //                     let date = new Date(result[i].created_at);
    //                     let time = formatHours(date);

    //                     dataUnitLabels.push(time);
    //                     dataUnit.push(result[i].value);
    //                 }
                    
    //                 dataLabels.push(dataUnitLabels);
    //                 dataHistory.push(dataUnit);
    //             }
    //         }
            
    //         labels.value = dataLabels;
    //         data.value = dataHistory;
    //     }
    // });

    const routesStore = useRoutesStore();
    // @ts-ignore
    const bread = ref([routesStore.routes[0][1], {
        label: "Device infos",
        to: "/iot/connected-home/demo/device",
        icon: 'i-ion-server-outline',
    }]);
</script>