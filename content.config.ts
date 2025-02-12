import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        docs: defineCollection({
            // Load every file inside the `content` directory
            source: 'https://github.com/IOT-Project-EI4/resources-and-management',

            // Specify the type of content in this collection
            type: 'page',
        }),
    }
})