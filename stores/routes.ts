import { defineStore } from 'pinia';

export const useRoutesStore = defineStore('routes', () => {
    const routes = [
        [
            {
                label: 'Introduction',
                icon: 'i-heroicons-book-open',
                to: "/",
            },
        ],
    ];

    return { routes }
});