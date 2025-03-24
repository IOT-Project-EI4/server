export interface Greenhouse {
    id: number;
    diameter: number;
    latitude: number;
    logitude: number;
    created_at: string;

    devices_groups: DeviceGroup[]; // List of devices groups
}

export interface DeviceGroup {
    id: number;
    name: string;
    greenhouse_id: number;
    created_at: string;

    devices: Device[];
}

export interface Device {
    id: number;
    name: string;
    mac_address: string;
    registered: number;
    device_group_id: number;
    created_at: string;

    sensors: Sensor[];
}

export interface Sensor {
    id: number;
    name: string;
    device_id: number;
    sensor_type_id: number;
    created_at: string;

    units: Unit[];
}

export interface Unit {
    id: number;
    name: string;
    symbol: string;
    lower_bound: number;
    upper_bound: number;

    latestData?: Measurement | undefined;
}

export interface Measurement {
    id: number;
    value: number;
    value_string: string;
    unit_id: number;
    created_at: string;
}