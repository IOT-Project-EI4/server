<template>
    <TemplateCard>
        <div class="flex-1 flex">
            <div v-if="status == 'success' && data" class="flex-1 flex flex-col overflow-hidden select-none duration-300 ease-in-out" :class="{ 'h-[150px]': !expand, 'h-[255px]': expand }">
                <div class="flex-1 flex flex-col overflow-hidden" @click="expand = !expand">
                    <div class="flex items-center text-[var(--ui-text-muted)]">
                        <div class="flex gap-1.5 scale-90 -ml-3">
                            <UIcon name="i-ion-location-outline" size="22" />
                            <p> Polytech - Saint-Cyr l'Ecole </p>
                        </div>
                    </div>
                    
                    <div class="flex duration-300 ease-in-out" :class="{ 'min-h-[110px]': !expand, 'min-h-[130px]': expand }">
                        <div class="flex-1 flex flex-col justify-center items-center duration-300 ease-in-out">
                            <p class="font-bold text-3xl"> {{ Math.round(data.current.temperature_2m) }}°C </p>
                            <p class="mt-3"> Perceived:&nbsp;<span class="font-semibold">{{ Math.round(data.current.apparent_temperature) }}°C</span> </p>
                        </div>

                        <div class="flex-1 flex justify-center pt-4 pb-4">
                            <img class="duration-300 ease-in-out" :src="`/icons/weather/${weatherIcons[data.current.weather_code]}.png`" :class="{ 'h-[70px]': !expand, 'h-[95px] mt-5': expand }">
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <div class="flex">
                            <p class="flex-1"> Humidity: <span class="font-semibold">{{ data.current.relative_humidity_2m }}%</span> </p>
                            <p> Precipitation: <span class="font-semibold">{{ data.current.precipitation }}mm</span> </p>
                        </div>

                        <div class="flex flex-row gap-4 whitespace-nowrap">
                            <p class="flex-1"> Wind Speed: <span class="font-semibold">{{ Math.round(data.current.wind_speed_10m) }}km/h</span> </p>
                            <p> Direction: <span class="font-semibold">{{ data.current.wind_direction_10m }}°</span> </p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center -mt-0.5 justify-end text-[var(--ui-text-muted)]" @click="refreshForcast">
                    <div class="scale-90 flex gap-1.5 -mr-3">
                        <p> Last forcast update: {{ lastForCastUpdateString }} </p>
                        <UIcon name="i-ion-refresh-outline" class="-mt-0.5" size="22" />
                    </div>
                </div>
            </div>

            <div v-else-if="status == 'pending' || status == 'idle'" class="flex-1 flex flex-col justify-center overflow-hidden">
                <USkeleton class="bg-[var(--ui-bg-accented)] h-[20px] w-[100px]" />
                
                <div class="flex h-[110px]">
                    <div class="flex-1 flex flex-col justify-center items-center">
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[36px] w-[52px]" />
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[24px] w-[96px] mt-2" />
                    </div>

                    <div class="flex-1 flex justify-center items-center pt-4 pb-4">
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[70px] w-[70px]" />
                    </div>
                </div>

                <div class="flex justify-end">
                    <USkeleton class="bg-[var(--ui-bg-accented)] h-[20px] w-[100px]" />
                </div>
            </div>

            <div v-else class="flex-1 flex flex-col justify-center items-center overflow-hidden h-[150px]">
                <p class="text-center font-semibol"> An error occured while loading <br /> this widget</p>
            </div>
        </div>
    </TemplateCard>
</template>

<script setup lang="ts">
    import TemplateCard from '~/components/ui/cards/template.vue';

    const expand = ref(false);

    const { data, status, refresh } = useLazyAsyncData<ApiResponse>('weather', async () => {
        let response : ApiResponse;

        if(!import.meta.dev) response = await $fetch('https://api.open-meteo.com/v1/forecast?latitude=48.804088&longitude=2.075677&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&forecast_days=1&models=meteofrance_seamless');
        else {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading time
            response = JSON.parse('{"latitude":48.8,"longitude":2.08,"generationtime_ms":0.13935565948486328,"utc_offset_seconds":3600,"timezone":"Europe/Berlin","timezone_abbreviation":"GMT+1","elevation":126.0,"current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°C","relative_humidity_2m":"%","apparent_temperature":"°C","is_day":"","precipitation":"mm","rain":"mm","weather_code":"wmo code","cloud_cover":"%","wind_speed_10m":"km/h","wind_direction_10m":"°"},"current":{"time":"2025-02-25T15:45","interval":900,"temperature_2m":8.8,"relative_humidity_2m":87,"apparent_temperature":3.9,"is_day":1,"precipitation":0.30,"rain":0.30,"weather_code":63,"cloud_cover":100,"wind_speed_10m":28.8,"wind_direction_10m":326}}');
        }

        return response;
    }, {
        server: false,
    });

    const lastForCastUpdateString = computed(() => {
        if(status.value == 'success' && data.value) {
            const date = new Date(data.value.current.time);
            return `${date.getHours()}:${date.getMinutes()}`;
        }

        return "";
    });

    onMounted(() => {
        setInterval(refreshForcast, 1000 * 60 * 15); // Refresh every 15 minutes
    });

    function refreshForcast() {
        expand.value = false;
        setTimeout(() => refresh(), 300);
    }

    // Map weather codes to icons filename
    const weatherIcons: Record<number, string> = {
        0: "clear",
        1: "mostly-clear",
        2: "partly-cloudy",
        3: "overcast",
        45: "fog",
        48: "rime-fog",
        51: "light-drizzle",
        53: "moderate-drizzle",
        55: "dense-drizzle",
        80: "light-rain",
        81: "moderate-rain",
        82: "heavy-rain",
        61: "light-rain",
        63: "moderate-rain",
        65: "heavy-rain",
        56: "light-freezing-drizzle",
        57: "dense-freezing-drizzle",
        66: "light-freezing-rain",
        67: "heavy-freezing-rain",
        77: "snowflake",
        85: "slight-snowfall",
        86: "heavy-snowfall",
        71: "slight-snowfall",
        73: "moderate-snowfall",
        75: "heavy-snowfall",
        95: "thunderstorm",
        96: "thunderstorm-with-hail",
        99: "thunderstorm-with-hail",
    };

    interface ApiResponse {
        current: Weather;
        current_units: any,
        elevation: number,
        generationtime_ms: number,
        latitude: number,
        longitude: number,
        timezone: string,
        timezone_abbreviation: string,
        utc_offset_seconds: number,
    }

    interface Weather {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        is_day: boolean;
        precipitation: number;
        rain: number;
        weather_code: number;
        cloud_cover: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
    }
</script>