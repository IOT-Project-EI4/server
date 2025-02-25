<template>
    <div class="flex-1 overflow-y-auto hide-scroll">
        <div class="flex flex-col gap-3">
            <div v-if="devices == 'loading'" v-for="index in 3">
                <USkeleton class="bg-[var(--ui-bg)] h-[320px] w-[342px] opacity-60 rounded-2xl" />
            </div>

            <div v-else-if="devices == 'error'">
                <p> Error </p>
            </div>

            <div v-else v-for="device, index in devices" :key="device.id" class="flex flex-col gap-3">
                <NuxtLink v-for="unit, unitIndex in device.units" :key="unit.id" :to="'/iot/connected-home/demo/device/' + device.id" >
                    <Doughnut class="bg-[var(--ui-bg-elevated)]" :id=unit.id :value=unit.latestData.value :title=unit.name :min=unit.lower_bound :max=unit.upper_bound :unit=unit.symbol :transparency="0.6" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    
    import BlankCard from '~/components/ui/cards/template.vue';
    import Doughnut from "~/components/ui/charts/doughnut.vue";

    import type { Room } from '~/interfaces/iot/connected-home';

    import { useIotConnectedHomeDeviceStore } from '~/stores/iot/connected-home/device';

    const deviceStore = useIotConnectedHomeDeviceStore();
    const { devices, pendingDevices } = storeToRefs(deviceStore);
</script>

