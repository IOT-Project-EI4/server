import { defineStore } from 'pinia';

import type { Device, Room, Unit, Measurement } from '~/interfaces/iot/connected-home';

import type { Loading, Error } from '~/interfaces/global';
import { cfetch  } from '~/composables/general/fetch';

export const useDevicesStore = defineStore('devicesStore', () => {
    const devices: Ref<Array<Device> | Loading | Error> = ref("loading");
    // const pendingDevices: Ref<Array<Device> | Loading | Error> = ref("loading");

    async function getGreenhouseDevices(greenhouse_id: number) {
        // Get devices from greenhouse
        await cfetch({
            url: "client/get-devices",
            query: { greenhouse_id: 1, },

            handler: (data: any | "error") => {
                if(data == "error") devices.value = "error";
                else if(data == undefined) devices.value = [];
                else devices.value = data.devices;
            }
        });
    }

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

    if(devices.value == "loading") getGreenhouseDevices(1); // useIotUserDataStore().houseID
    // if(pendingDevices.value == "loading") getPendingDevices();

    // return { devices, pendingDevices, getHouseDevices, getPendingDevices, registerNewDevice, loadDeviceDataHistory }
    return { devices, getGreenhouseDevices }
});