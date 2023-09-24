import { z } from 'zod';

export const createPostSchema = z
	.object({
		text: z.string().max(250).trim(),
		media: z.array(z.string().url({ message: 'Invalid Url' })).optional(),
	})
	.strict();

export const postIdSchema = z
	.object({
		postId: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid Post Id' }),
	})
	.strict();

export const paginationSchema = z
	.object({
		page: z.string().trim(),
		limit: z.string().trim(),
	})
	.strict();

export type CreatePostSchema = z.infer<typeof createPostSchema>;

export type PostIdSchema = z.infer<typeof postIdSchema>;

export type PaginationSchema = z.infer<typeof paginationSchema>;
