<template>
    <TemplateCard>
        <div class="flex-1 flex justify-center items-center">
            <p v-if="time" class="font-bold text-lg"> {{ dateString }}, {{ time }} </p>
            <USkeleton v-else class="bg-[var(--ui-bg-accented)] h-[29px] w-[260px]" />
        </div>
    </TemplateCard>
</template>

<script setup lang="ts">
    import { months, weekDays } from '~/constants/date';

    import TemplateCard from '~/components/ui/cards/template.vue';

    const dateString: Ref<string> = ref("");
    const time: Ref<string> = ref("");

    let interval: NodeJS.Timeout;
    onMounted(() => {
        interval = setInterval(calcDate, 10000);
    });

    onUnmounted(() => {
        clearInterval(interval);
    });

    // Function to pad number to 2 digits
    const pad = (n: number) => n < 10 ? `0${n}` : n;

    function calcDate(): void {
        const date = new Date();

        // Set date to format: Lundi 12 Septembre
        dateString.value = `${weekDays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
        time.value = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    calcDate(); // Call function to set initial date
</script>