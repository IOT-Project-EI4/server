<template>
    <div class="flex-1 flex flex-col">
        <UBreadcrumb class="mb-5 mt-1.5" :items="bread" />
        
        <div class="flex-1 flex overflow-hidden justify-center">
            <div class="flex max-w-[1000px] w-[1000px] overflow-auto">
                <ContentRenderer v-if="markdown" class="markdown-renderer" :value="markdown" />

                <div v-else>
                    <p> test </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute();
    const routesStore = useRoutesStore();

    // @ts-ignore
    const bread = ref([routesStore.routes[0][1], {
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
    const { data: markdown } = await useAsyncData("", async () => {
        let data = await queryCollection('test').path(filePath).first();
        if(data == null) data = await queryCollection('test').path("/docs/gestion-de-projet/milestone-1/management/readme").first();
        
        fixImagesPath(data.body.value);
        return data;
    });

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
</script>