<template>
    <div class="relative flex-1 overflow-hidden -m-3">
        <div class="absolute w-full h-full overflow-y-auto overflow-x-hidden">
            <!-- Intro -->
            <div class="relative h-full w-full overflow-hidden flex">
                <div class="absolute h-full w-full overflow-hidden lg:pl-40 lg:pt-20 lg:pr-10 lg:pb-10">
                    <div class="relative h-full flex-1 overflow-hidden lg:rounded-3xl flex p-3 lg:p-10 bg-[var(--ui-bg-elevated)] opacity-0 delay-100 duration-500 ease-in-out" :class="{ 'opacity-100': loadAnimation }">
                        <img src="/public/images/Landing illustration.webp" class="h-full w-full object-cover rounded-2xl opacity-0 delay-300 duration-500 ease-in-out" :class="{ 'opacity-100': loadAnimation }" />
                    </div>
                </div>

                <div class="absolute ml-6 lg:ml-10 mt-6 lg:mt-10 mr-6 lg:mr-10 overflow-hidden rounded-2xl p-5 lg:p-10 flex backdrop-blur-2xl opacity-0 delay-500 duration-500 ease-in-out" :class="{ 'opacity-100': loadAnimation }">
                    <div class="absolute w-full h-full top-0 left-0 bg-[var(--ui-bg-elevated)] opacity-50"></div>

                    <div class="z-10">
                        <h1 class="text-3xl lg:text-5xl font-semibold"> Intelligent <span class="text-[var(--ui-primary)]">Greenhouse</span> Farming </h1>
                        <p class="mt-8 text-lg lg:text-xl"> 
                            Our solutions empowers argricultural operators, reduces operation <br /> costs,
                            improves crop quality, and increases yield rate.
                        </p>
                    </div>
                </div>

                <div class="absolute left-1/2 top-full -translate-x-1/2 -translate-y-full -mt-5 lg:-mt-10 lg:ml-18 cursor-pointer opacity-0 delay-1000 duration-500 ease-in-out" :class="{ 'opacity-100': loadAnimation }">
                    <div class="h-18 w-18 rounded-full bg-[var(--ui-bg-accented)] flex justify-center items-center animate-bounce">
                        <UIcon name="i-ion-arrow-down" class="text-[var(--ui-text)]" size="30" />
                    </div>
                </div>
            </div>

            <div class="h-[200px] w-full flex justify-center items-center">
                <p class="font-semibold text-xl"> Work in progress ... </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


    const loadAnimation = ref(false);

    onMounted(() => {
        setTimeout(() => {
            loadAnimation.value = true;
        }, 100);
    });
</script>