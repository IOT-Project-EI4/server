<template>
    <TemplateCard>
        <div class="flex-1 flex justify-center items-center">
            <div v-if="weather" class="z-10 flex-1 flex flex-col overflow-hidden">
                <div class="flex flex-row gap-10">
                    <div class="flex flex-col justify-center items-center">
                        <p class="font-bold text-3xl"> {{ Math.round(weather.temperature_2m) }}°C </p>
                        <p class="w-full mt-2"> Perceived: <span class="font-semibold">{{ Math.round(weather.apparent_temperature) }}°C</span> </p>
                    </div>

                    <div class="flex-1 flex justify-center items-center pt-2 pb-2">
                        <img class="h-[70px] drop-shadow-xl shadow-white" :src="`/icons/weather/${weatherIcons[weather.weather_code]}.png`" />
                    </div>
                </div>

                <div class="flex flex-col text-md mt-2">
                    <div class="flex flex-row">
                        <p class="text-md flex-1"> Humidity: <span class="font-semibold">{{ weather.relative_humidity_2m }}%</span> </p>
                        <p class="text-md"> Precipitation: <span class="font-semibold">{{ weather.precipitation }}mm</span> </p>
                    </div>

                    <div class="flex flex-row gap-4 whitespace-nowrap">
                        <p class="text-md flex-1"> Wind Speed: <span class="font-semibold">{{ Math.round(weather.wind_speed_10m) }}km/h</span> </p>
                        <p class="text-md"> Direction: <span class="font-semibold">{{ weather.wind_direction_10m }}°</span> </p>
                    </div>
                </div>
            </div>

            <div v-else class="z-10 flex-1 flex flex-col overflow-hidden">
                <div class="flex flex-row gap-10">
                    <div class="flex flex-col justify-center items-center">
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[36px] w-[52px]" />
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[24px] w-[96px] mt-2" />
                    </div>

                    <div class="flex-1 flex justify-center items-center pt-2 pb-2">
                        <USkeleton class="bg-[var(--ui-bg-accented)] h-[70px] w-[70px]" />
                    </div>
                </div>

                <div class="flex flex-col gap-2 text-md mt-2">
                    <USkeleton class="bg-[var(--ui-bg-accented)] h-[24px] w-[288px]" />
                    <USkeleton class="bg-[var(--ui-bg-accented)] h-[24px] w-[288px]" />
                </div>
            </div>
        </div>
    </TemplateCard>
</template>

<script setup lang="ts">
    import TemplateCard from '~/components/ui/cards/template.vue';

    const weather: Ref<Weather | null> = ref(null);

    if(!import.meta.dev) {
        await useLazyFetch('https://api.open-meteo.com/v1/forecast?latitude=48.804088&longitude=2.075677&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&forecast_days=1&models=meteofrance_seamless', {
            server: false,

            onResponse({ request, response, options }) {
                if(response._data) weather.value = response._data.current;
            }
        });
    } else {
        // Use API credits only in production
        weather.value = JSON.parse('{"time":"2024-12-27T14:15","interval":900,"temperature_2m":3.8,"relative_humidity_2m":93,"apparent_temperature":2.7,"is_day":1,"precipitation":0,"rain":0,"weather_code":3,"cloud_cover":100,"wind_speed_10m":2.5,"wind_direction_10m":172}');
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

    interface Weather {
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