<template>
    <div class="h-23 flex-1 flex items-center justify-center">
        <div class="w-[400px] 2xl:w-[600px] flex flex-col justify-center duration-300">
            <UModal v-model:open="open" focusable="false">
                <UButton focusable="false" color="neutral" variant="subtle">
                    <div class="flex flex-row gap-2 items-center flex-1">
                        <UIcon name="i-lucide-search" class="text-[var(--ui-text-muted)]" />
                        <p class="text-[var(--ui-text-muted)]"> Search ... </p>
                    </div>

                    <UKbd size="lg">&nbsp;Ctrl&nbsp;</UKbd> + <UKbd size="lg"> s </UKbd>
                </UButton>


                <template #content>
                    <UCommandPalette v-model:search-term="searchTerm" :loading="status === 'pending'" :groups="groups" placeholder="Search ..." class="h-80" @update:model-value="onSelect" />
                </template>
            </UModal>
        </div>
    </div>
</template>

<script setup lang="ts">
    const searchTerm = ref('');
    const open = ref(false);

    const { data: docsTitles, status } = useLazyAsyncData('search-sections', async () => {
        let result = await queryCollectionSearchSections('test');

        let formattedResult: any = [];
        let savedTitles: any = [];

        for(let section of result) {
            let docType: string;

            if(section.id.includes('#')) docType = "Section";
            else docType = "Page";

            if(!savedTitles.includes(section.title)) {
                formattedResult.push({
                    label: "<b>" + docType + "</b>: <i>" + section.title + "</i>",
                    to: section.id,
                });
            }

            savedTitles.push(section.title);
        }

        return formattedResult;
    }); 

    function onSelect(selectedItem: any) {
        open.value = false;
        useRouter().push(selectedItem.to.replaceAll('gestion-de-projet/', '').replaceAll('milestone-', 'milestones/').replaceAll('readme', '').replaceAll('/#', '#'));
    }

    const groups = computed(() => [{
        id: 'pages',
        label: 'Main pages',
        items: [{
                label: 'Home',
                to: '/',
            }, {
                label: 'Dashboard',
                to: '/dashboard',
            }, {
                label: 'Documentation',
                to: '/docs',
            }],
        }, {
            id: 'docs',
            label: 'Documentation',
            items: docsTitles.value || [],
        }]);

    function openSearch(event: any) {
        if(event.ctrlKey && event.key == 's') {
            event.preventDefault();
            open.value = !open.value;
        }
    }
    
    onMounted(() => {
        window.addEventListener('keydown', openSearch);
    });
</script>