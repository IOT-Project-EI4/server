<template>
    <TemplateCard :transparency=transparency>
        <div class="flex-1 flex flex-col gap-4">
            <p class="text-2xl font-bold"> {{ title }}<span v-if="subtitle" class="text-[var(--ui-text-muted)] text-lg font-normal">, {{ subtitle }} </span> </p>

            <div class="flex gap-5 items-center">
                <div class="relative flex-1 max-h-[240px] aspect-square overflow-hidden">
                    <Chart type="doughnut" :data="chartData" :options="chartOptions" />

                    <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center">
                        <p class="font-bold text-3xl"> {{ value }}{{ unit }} </p>
                        <p v-if="targetValue != undefined" class="-mt-1"> Target: <span class="font-semibold">{{ targetValue }}{{ unit }}</span> </p>
                    </div>
                </div>

                <div v-if="targetValue != undefined" class="w-[50px] flex flex-col gap-5">
                    <div @click="more" class="p-3 rounded-md bg-[var(--ui-bg-accented)] flex justify-center items-center">
                        <UIcon class="h-[40px] w-[40px]" name="i-ion-chevron-up-outline" />
                    </div>

                    <div @click="less" class="p-3 rounded-md bg-[var(--ui-bg-accented)] flex justify-center items-center">
                        <UIcon class="h-[40px] w-[40px]" name="i-ion-chevron-down-outline" />
                    </div>
                </div>
            </div>
        </div>
    </TemplateCard>
</template>

<script setup lang="ts">
    import { Chart } from 'vue-chartjs';
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement } from 'chart.js';

    import TemplateCard from '~/components/ui/cards/template.vue';

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, ArcElement);

    const props = defineProps({
        id: {
            type: Number,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        subtitle: {
            type: String,
            default: ''
        },

        value: {
            type: Number,
            required: true
        },

        targetValue: {
            type: Number,
            default: undefined,
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
        },

        transparency: {
            type: Number,
            default: 0.5,
        }
    });

    const emit = defineEmits(['targetPlus', 'targetMinus']);

    const bgColor = ref<string>('');
    const primaryColor = ref<string>('');
    const secondaryColor = ref<string>('');
    const warningColor = ref<string>('');

    const data: Ref<number[]> = ref([]);
    const backgroundColors: Ref<string[]> = ref([]);

    watchEffect(() => {
        if(props.targetValue != undefined) {
            let min = Math.min(props.value, props.targetValue);
            let max = Math.max(props.value, props.targetValue);

            data.value = [Math.abs(props.min) + min, max - min, props.max - max];
            backgroundColors.value = [primaryColor.value, secondaryColor.value, bgColor.value];

            if(min == props.targetValue) backgroundColors.value[1] = warningColor.value;
        } else {
            data.value = [props.value, props.max - props.value];
            backgroundColors.value = [primaryColor.value, bgColor.value];
        }
    });

    const chartData = computed(() => {
        return {
            datasets: [
                {
                    data: data.value,

                    backgroundColor: backgroundColors.value,
                    borderWidth: 0,
                },
            ],
        };
    });

    const chartOptions = computed(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
            },

            cutout: '80%',
        };
    });

    onMounted(() => {
        bgColor.value = getComputedStyle(document.body).getPropertyValue('--ui-bg-accented');
        primaryColor.value = getComputedStyle(document.body).getPropertyValue('--ui-primary');
        secondaryColor.value = getComputedStyle(document.body).getPropertyValue('--ui-secondary');
        warningColor.value = getComputedStyle(document.body).getPropertyValue('--ui-warning');
    });
    
    function more(event: MouseEvent) {
        event.preventDefault();
        emit('targetPlus');
    }

    function less(event: MouseEvent) {
        event.preventDefault();
        emit('targetMinus');
    }
</script>