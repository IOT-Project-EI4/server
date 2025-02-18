import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        test: defineCollection({
            // Load every file inside the `content` directory
            source: {
                cwd: 'public/resources-and-management',
                include: '**/*.md',
                exclude: ['**/*.xlsx'],
            },

            schema: z.object({
                rawbody: z.string()
            }),

            // Specify the type of content in this collection
            type: 'page',
        }),
    }
})