import { defineStore } from 'pinia';

import { SERVER_URL } from '~/constants/server';

import type { Loading, Error } from '~/interfaces/global';
import { cfetch  } from '~/composables/general/fetch';

export const useDevicesStore = defineStore('devicesStore', () => {
    // const pendingDevices: Ref<Array<Device> | Loading | Error> = ref("loading");

    const { data : devices, status : devicesStatus, refresh: devicesRefresh } = useLazyAsyncData('devices', async () => {
        let response : any = await $fetch(SERVER_URL + "client/get-devices", {
            query: { greenhouse_id: 1, },
        });

        return JSON.parse(response).devices;
    });

    // async function getPendingDevices() {
    //     await cfetch({
    //         url: "iot/connected-home/client/get-pending-devices",

    //         handler: (data: any | "error") => {
    //             if(data == "error") pendingDevices.value = "error";
    //             else if(data == undefined) pendingDevices.value = [];
    //             else pendingDevices.value = data.devices;
    //         }
    //     });
    // }

    // async function registerNewDevice(house_id: number, device: Device, deviceName: string, selectedRoom: Room) {
    //     await cfetch({
    //         url: "iot/connected-home/client/register-device",
    //         method: "POST",

    //         body: JSON.stringify({ house_id: house_id, mac_adr: device.mac_adr, name: deviceName, room_id: selectedRoom.id }),

    //         handler: (data: any | "error") => {
    //             pendingDevices.value = "loading";
    //             getPendingDevices();
    //         }
    //     });
    // }

    // async function loadDeviceDataHistory(device: Device, unit: Unit): Promise<Array<Measurement> | "error"> {
    //     let result: Array<Measurement> | "error" = [];

    //     await cfetch({
    //         url: "iot/connected-home/client/get-device-data-history",
    //         query: { device_id: device.id, unit_id: unit.id },

    //         handler: (data: { data: Array<Measurement> } | "error") => {
    //             if(data == "error") result = "error";
    //             else if(data == undefined) result = [];
    //             else result = data.data;
    //         }
    //     });

    //     return result;
    // }

    return { devices, devicesStatus, devicesRefresh }
});