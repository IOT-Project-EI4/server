import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        test: defineCollection({
            // Load every file inside the `content` directory
            source: {
                include: "**",
                repository: "https://github.com/valentin-llv/CGS-server_Projet-EI4",
            },

            // Specify the type of content in this collection
            type: 'page',
        }),
    }
})