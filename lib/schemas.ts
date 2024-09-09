import { z } from 'zod';

export const ThreadSchema = z.object({
    title: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    description: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadCategory: z.string().min(1, {
        message: 'Thread category is required.',
    }),
    isQnA: z.boolean().optional(),
    tags: z.array(z.object({
        threadTagId: z.string(),
        tagType: z.enum([
            "WEB DEVELOPMENT",
            "MOBILE DEVELOPMENT",
            "DATA SCIENCE",
            "MACHINE LEARNING",
            "DEVOPS",
            "UI/UX DESIGN",
            "CYBERSECURITY",
            "CLOUD COMPUTING",
            "GAME DEVELOPMENT",
            "DATABASES"
        ])
    })).nonempty({
        message: 'At least one tag is required.',
    }),
});