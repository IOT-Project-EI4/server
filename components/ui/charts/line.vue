<template>
    <div class="flex flex-col overflow-hidden rounded-lg p-3 gap-3 bg-[var(--ui-bg-elevated)]">
        <p class="text-2xl font-bold m-1"> {{ title }} </p>

        <Chart class="max-h-[240px]" type="line" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
    import { Chart } from 'vue-chartjs';
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement, LineController } from 'chart.js';

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement, LineController);

    const props = defineProps({
        id: {
            type: Number,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        data: {
            type: Array<number>,
            required: true
        },

        labels: {
            type: Array<string>,
            required: true
        },

        min: {
            type: Number,
            default: -10
        },

        max: {
            type: Number,
            default: 50
        },

        unit: {
            type: String,
            required: true
        }
    });

    const bgColor = ref<string>('');
    const primaryColor = ref<string>('');
    const textMutedColor = ref<string>('');

    const chartData = computed(() => {
        return {
            labels: props.labels,

            datasets: [
                {
                    data: props.data,

                    backgroundColor: transparentize(primaryColor.value, 0.25),
                    borderColor: transparentize(primaryColor.value, 0.8),

                    fill: "start",
                    tension: 0.4,
                },
            ],
        };
    });

    function transparentize(value: string, opacity: number) {
        return value.slice(0, -1) + ' / ' + opacity + ')';
    }

    const chartOptions = computed(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
            },

            scales: {
                x: {
                    border: {
                        color: transparentize(textMutedColor.value, 0.7),
                        width: 1.5,
                    },

                    grid: { display: false },

                    ticks: {
                        color: textMutedColor.value,
                        font: { size: 15 },
                    },
                },

                y: {
                    border: {
                        color: transparentize(textMutedColor.value, 0.7),
                        width: 1.5,
                    },

                    grid: {
                        color: transparentize(textMutedColor.value, 0.7),
                        lineWidth: 1.5,
                    },

                    ticks: {
                        color: textMutedColor.value,
                        font: { size: 15 },
                    },
                    
                    max: props.max,
                    min: props.min,
                },
            },
        };
    });

    onMounted(() => {
        bgColor.value = getComputedStyle(document.body).getPropertyValue('--ui-bg-elevated');
        primaryColor.value = getComputedStyle(document.body).getPropertyValue('--ui-primary');
        textMutedColor.value = getComputedStyle(document.body).getPropertyValue('--ui-text-muted');
    });
</script>