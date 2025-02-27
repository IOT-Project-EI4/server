<template>
    <TemplateCard :transparency=transparency>
        <div class="flex-1 flex flex-col">
            <p class="text-2xl font-bold"> {{ title }}<span v-if="subtitle" class="text-[var(--ui-text-muted)] text-lg font-normal">, {{ subtitle }} </span> </p>

            <div class="flex flex-1 items-center justify-center p-5">
                <p class="font-bold text-3xl"> {{ value }}{{ unit }} </p>
            </div>
        </div>
    </TemplateCard>
</template>

<script setup lang="ts">
    import TemplateCard from '~/components/ui/cards/template.vue';

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

        unit: {
            type: String,
            required: true
        },

        transparency: {
            type: Number,
            default: 0.5,
        }
    });
</script>