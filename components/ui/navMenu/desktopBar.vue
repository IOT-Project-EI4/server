<template>
    <div class="h-23 flex-1 flex items-center">
        <div class="w-[400px] flex flex-col">
            <UModal v-model:open="open" focusable="false">
                <UButton focusable="false" label="Search ..." color="neutral" variant="subtle" icon="i-lucide-search" />

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
            if(!savedTitles.includes(section.title)) {
                formattedResult.push({
                    label: section.title,
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
        label: 'Pages',
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

    // define a handler
    function openSearch(event: any) {
        if (event.ctrlKey && event.key == 's') {
            event.preventDefault();
            open.value = !open.value;
        }
    }
    
    onMounted(() => {
        document.addEventListener('keydown', openSearch);

        watchEffect(() => {
            if(!open.value) {
                console.log(document.getElementById('button'));
                // document.getElementById('button').blur();
            }
        });
    });
</script>