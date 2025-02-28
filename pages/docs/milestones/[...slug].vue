<template>
    <div class="flex-1 flex flex-col overflow-hidden" :class="{ '-mr-1.5': !showDesktop }">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />
        
        <div class="flex-1 flex overflow-x-hidden" :class="{ 'overflow-hidden -mt-3': showDesktop, 'flex-col overflow-y-auto': !showDesktop }">
            <div v-if="showDesktop" class="flex">
                <div class="flex flex-col w-[320px] mt-4 pl-4 pr-4 gap-3 overflow-auto">
                    <h3 class="text-xl font-bold"> Table of contents </h3>

                    <div class="flex flex-col gap-4">
                        <p ref="tocElements" @click="scrollIntoView(item.id)" class="text-md font-normal cursor-pointer duration-300" v-for="item, index in markdown?.body.toc?.links" :key="item.id" :href="`#${item.id}`" :id="item.id + '-toc'" :title="item.text"> {{ index + 1 }}. {{ item.text }} </p>
                    </div>
                </div>

                <USeparator orientation="vertical" class="pb-6" />
            </div>

            <div v-else>
                <UAccordion :unmountOnHide=false :items="items" class="pr-3 pl-3 -mt-3">
                    <template #body="{ item }">
                        <div class="flex flex-col gap-4">
                            <p ref="tocElements" @click="scrollIntoView(item.id)" class="text-md font-normal cursor-pointer duration-300" v-for="item, index in markdown?.body.toc?.links" :key="item.id" :href="`#${item.id}`" :id="item.id + '-toc'" :title="item.text"> {{ index + 1 }}. {{ item.text }} </p>
                        </div>
                    </template>
                </UAccordion>

                <USeparator class="pl-3 pr-3 mb-2 mt-2" :class="{ 'hidden': showDesktop }" />
            </div>
            
            <div class="flex-1 flex justify-center" :class="{ 'overflow-y-auto overflow-x-hidden pl-5': showDesktop }">
                <div class="flex-1 flex max-w-[1000px] w-[1000px] pr-1" :class="{ 'pr-3': showDesktop, 'overflow-hidden': !showDesktop }">
                    <ContentRenderer id="mk-renderer" v-if="markdown" class="markdown-renderer flex flex-1" :value="markdown" :class="{ 'overflow-hidden': !showDesktop }" />

                    <!-- <div v-else>
                        <p class="text-red-500"> No content available. </p>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute();
    const routesStore = useRoutesStore();

    const displayStore = useDisplayStore();
    const { showDesktop } = storeToRefs(displayStore);

    const tocElements = ref();

    // @ts-ignore
    const bread = ref([routesStore.routes[1][0], {
        label: "Milestone " + route.params.slug[0],
        to: "/docs/milestones/" + route.params.slug[0],
    }]);

    let basePath = `/docs/gestion-de-projet/milestone-${route.params.slug[0]}/`;
    for(let i = 1; i < route.params.slug.length; i++) {
        basePath += route.params.slug[i] + '/';

        let label = route.params.slug[i].replaceAll("-", " ").slice(0, 1).toUpperCase() + route.params.slug[i].replaceAll("-", " ").slice(1);
        bread.value.push({
            label: label,
            to: bread.value[i].to + "/" + route.params.slug[i],
        });
    }

    let filePath = route.params.slug.length == 1 ? basePath + "readme" : basePath.slice(0, basePath.length - 1) + "";   
    const { data: markdown, status, refresh } = useLazyAsyncData("", async () => {
        let data = await queryCollection('test').path(filePath).first();
        if(data == null) data = await queryCollection('test').path("/docs/gestion-de-projet/milestone-1/management/readme").first();
        
        fixImagesPath(data.body.value);
        fixTables(data.body.value);
        return data;
    });

    let observer : IntersectionObserver;
    onUnmounted(() => {
        if(observer) observer.disconnect();
    });

    onMounted(() => {
        watchPostEffect(() => {
            if(status.value == "success") {
                document.getElementById(route.hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });

                observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        let tocItem = document.getElementById(entry.target.id + '-toc');

                        if(entry.isIntersecting) {
                            if(tocItem) tocItem.classList.add("text-[var(--ui-primary)]");
                        } else {
                            if(tocItem) tocItem.classList.remove("text-[var(--ui-primary)]");
                        }
                    });
                }, { threshold: 0.5 });

                markdown.value?.body.toc?.links.forEach((item: any) => {
                    nextTick(() => {
                        setTimeout(() => {
                            const targetElement = document.getElementById(item.id);
                            if (targetElement) observer.observe(targetElement);
                        }, 0);
                    });
                });
            }
        });
    });

    const items = [
        {
            label: 'Table of contents',
            icon: 'i-ion-document-text-outline'
        }
    ];

    function scrollIntoView(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    function fixImagesPath(data: Array<any>): Array<any> {
        for(let i = 0; i < data.length; i++) {
            if(data[i] == 'img') {
                data[i + 1].src = "/resources-and-management/docs/" + data[i + 1].src.slice(6); 
            } else if(data[i] == 'a') {
                if(data[i + 1].href.includes("http")) {
                    data[i + 1].target = "_blank";
                } else {
                    data[i + 1].href = data[i + 1].href.replaceAll("percent20", "-");
                    data[i + 1].href = route.params.slug[0] + "/" + data[i + 1].href;
                }
            } else if(data[i] instanceof Array) {
                data[i] = fixImagesPath(data[i]);

                if(data[i][0] == 'img') {
                    data[i - 1].class = "image-title";
                    data.splice(i + 1, 0, data[i][1].alt);
                }
            }
        }

        return data;
    }

    function fixTables(data: Array<any>): Array<any> {
        for(let i = 0; i < data.length; i++) {
            if(data[i] instanceof Array) {
                if(data[i][0] == 'table') {
                    data[i] = [
                        'div',
                        { class: 'mdc-table flex overflow-visible' },
                        [
                            'div',
                            { class: 'overflow-x-auto pb-2' },
                            data[i],
                        ]
                    ]
                }  else data[i] = fixTables(data[i]);
            }
        }

        return data;

    }
</script>