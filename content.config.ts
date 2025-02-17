import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        test: defineCollection({
            // Load every file inside the `content` directory
            source: {
                cwd: 'docs/resources-and-management',
                include: '**',
            },

            schema: z.object({
                rawbody: z.string()
            }),

            // Specify the type of content in this collection
            type: 'page',
        }),
    }
})