import { defineStore } from 'pinia';

export const useRoutesStore = defineStore('routes', () => {
    const routes = [
        [
            {
                label: 'Introduction',
                icon: 'i-heroicons-book-open',
                to: "/",
            },

            {
                label: 'Documentation',
                icon: 'i-ion-file-tray-full-outline',
                to: "/docs",

                children: [
                    // {
                    //     label: 'Introduction',
                    //     to: '/docs',
                    // },

                    {
                        label: 'Revue de projet 1',
                        to: '/docs/milestones/1',
                    },

                    // {
                    //     label: 'Revue de projet 2',
                    //     to: '/docs/milestones/2',
                    // },
                ],
            },
        ],
    ];

    return { routes }
});