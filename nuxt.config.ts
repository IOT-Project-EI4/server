export default defineNuxtConfig({
    compatibilityDate: '2025-02-01',
    devtools: { enabled: false },

    nitro: {
        experimental: {
            tasks: true
        }
    },

    modules: ['@nuxt/ui', '@nuxt/content', '@pinia/nuxt', '@nuxtjs/device', '@nuxthq/studio'],

    runtimeConfig: {
        ENV: process.env.ENV,

        DB: {
            DB_NAME: ["smart-farming"],
            DB_HOST: process.env.DB_HOST,

            DB_USER: process.env.DB_USER,
            DB_PASS: process.env.DB_PASS,

            DB_CONNECTION_LIMIT: 10,
            DB_WAIT_FOR_CONNECTIONS: true,

            DB_QUEUE_LIMIT: 10,
            DB_MULTIPLE_STATEMENTS: true,
        },

        SOCKET: {
            PORT: 12010,
        }
    },

    css: ['~/assets/main.css'],

    ui: {
        fonts: true,
    },

    fonts: {
        defaults: {
            weights: [400, 500, 600, 700, 800, 900],
            styles: ['normal'],
            subsets: ['latin-ext', 'latin']
        },

        families: [
            { name: 'DM Sans', provider: 'google' },
        ]
    },

    pinia: {
        storesDirs: ['./stores/**/*.ts'],
    },

    content: {
        build: {
            markdown: {
                highlight: {
                    theme: 'github-dark',
                    langs: ['ts']
                }
            }
        }
    }
});