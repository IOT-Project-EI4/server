<template>
    <div class="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pr-3">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />

        <div class="flex-1 flex flex-col gap-3">
            <div v-if="dataStatus == 'error'">
                <p class="text-red-500"> Device not found </p>
            </div>

            <div v-else-if="dataStatus == 'idle' || dataStatus == 'pending'" v-for="index in 5" class="flex gap-3" :class="{ 'flex-row-reverse': index % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }">
                <USkeleton class="bg-[var(--ui-bg-elevated)] h-[320px] w-full" />
            </div>

            <!-- :class="{ 'flex-row-reverse': unit.id % 2 == 0 && showDesktop, 'flex-col-reverse': !showDesktop }" -->
            <div v-else class="flex flex-col gap-3">
                <div class="flex gap-3 items-center">
                    <p> Du: </p>

                    <UPopover>
                        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
                            {{ fromDate ? df.format(fromDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="fromDate" class="p-2" />
                        </template>
                    </UPopover>

                    <p> à: </p>
                    
                    <UPopover>
                        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
                            {{ toDate ? df.format(toDate.toDate(getLocalTimeZone())) : 'Select a date' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="toDate" class="p-2" />
                        </template>
                    </UPopover>
                </div>

                <div v-for="sensor, sensorIndex in deviceData.sensors" :key="sensor.id" class="flex flex-col">
                    <div v-for="unit, unitIndex in sensor.units" :key="unit.id" class="flex-1 flex flex-col gap-3 pb-2 overflow-x-auto">
                        <Line class="flex-1 min-w-[700px]" :id="`unit_${unit.id}`" :data="data[sensorIndex][unitIndex]" :labels="labels[sensorIndex][unitIndex]" :title="`${sensor.name} - ${unit.name}`" :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                    </div>

                    <!-- <Line class="flex-1" :id=unit.id :data="data[index]" :labels="labels[index]" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol />
                    <Doughnut class="bg-[var(--ui-bg-elevated)]" :id=unit.id :value=unit.latestData.value :targetValue="25" :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol /> -->
                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
    import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

    import Line from "@/components/ui/charts/line.vue";
    import Doughnut from "~/components/ui/charts/doughnut.vue";

    import { SERVER_URL } from "~/constants/server";
    
    import { useGreenhouseStore } from '~/stores/greenhouse';
    import { useDisplayStore } from "~/stores/display";

    definePageMeta({
        validate: async (route) => {
            if(typeof route.params.id == 'object') route.params.id = route.params.id[0];
            return typeof parseInt(route.params.id) == 'number' && !isNaN(parseInt(route.params.id));
        }
    });

    const route = useRoute();

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);

    const deviceId: number = useRoute().params.id as any;

    const grennhouseStore = useGreenhouseStore();
    const { greenhouse, greenhouseLoadingStatus } = storeToRefs(grennhouseStore);

    const device: any = ref(null);

    const firstLoad = ref(true);

    const { data : deviceData, status : dataStatus, refresh: dataRefresh } = useLazyAsyncData('deviceData', async () => {
        // Add + 1 day to toDate
        let nextDay = new Date(toDate.value.year, toDate.value.month - 1, toDate.value.day + 1);

        let response : any = await $fetch(SERVER_URL + "client/get-device-data-history", {
            query: {
                device_id: device.value.id,
                from: new Date(fromDate.value.year, fromDate.value.month - 1, fromDate.value.day).getTime(),
                to: new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()).getTime(),
            },
        });

        return JSON.parse(response);
    }, {
        watch: [device],
        immediate: false,
    });

    watchEffect(() => {
        if(greenhouseLoadingStatus.value == 'idle' || greenhouseLoadingStatus.value == 'pending' || greenhouseLoadingStatus.value == 'error') return;
        else {
            if(!greenhouse.value) return;

            // Check if device id is in devices
            // let deviceObject = devices.value.find((device: any) => device.id == deviceId);
            let deviceObject = greenhouse.value.devices_groups.flatMap((group: any) => group.devices).find((device: any) => device.id == deviceId);

            if(deviceObject == undefined) device.value = null;
            else device.value = deviceObject;
        }
    });

    function scrollIntoView(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

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

            nextTick(() => {
                setTimeout(() => {
                    if(firstLoad.value) {
                        firstLoad.value = false;
                        document.getElementById(route.hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
                    }
                }, 50);
            });
        }
    });

    // Get today date, substract 7 days, and get year, month and day
    const today = new Date();
    const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const toDate = shallowRef(new CalendarDate(nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate()));

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const fromDate = shallowRef(new CalendarDate(lastWeek.getFullYear(), lastWeek.getMonth() + 1, lastWeek.getDate()));

    const df = new DateFormatter('fr-FR');

    // On calendar date change, refresh data
    watchEffect(() => {
        if(fromDate.value) dataRefresh();
        if(toDate.value) dataRefresh();
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