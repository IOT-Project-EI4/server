import { defineStore } from 'pinia';

export const useRoutesStore = defineStore('routes', () => {
    const routes = [
        [
            {
                label: 'Introduction',
                icon: 'i-ion-book-outline',
                to: "/",
            },

            {
                label: 'Dashboard',
                icon: 'i-ion-easel-outline',
                to: "/dashboard",
                children: [
                    {
                        label: 'Main',
                        to: '/dashboard',
                    },

                    {
                        label: 'Devices',
                        // to: '/dashboard/devices',
                    },
                ],
            },

            {
                label: 'Documentation',
                icon: 'i-ion-file-tray-full-outline',
                to: "/docs",

                children: [
                    {
                        label: 'Introduction',
                        to: '/docs',
                    },

                    {
                        label: 'Revue de projet 1',
                        to: '/docs/milestones/1',
                    },

                    {
                        label: 'Revue de projet 2',
                        to: '/docs/milestones/2',
                    },

                    {
                        label: 'Revue de projet 3',
                        to: '/docs/milestones/3',
                    },
                ],
            },
        ],
    ];

    return { routes }
});