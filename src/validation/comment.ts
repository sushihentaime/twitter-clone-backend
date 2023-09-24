import { z } from 'zod';

export const createCommentSchema = z
	.object({
		text: z.string().max(250).trim(),
		media: z.array(z.string().url({ message: 'Invalid Url' })).optional(),
	})
	.strict();

export const deleteCommentSchema = z
	.object({
		postId: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid Post Id' }),
		commentId: z
			.string()
			.regex(/[0-9a-fA-F]{24}$/, { message: 'Invalid Comment Id' }),
	})
	.strict();

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

export type DeleteCommentSchema = z.infer<typeof deleteCommentSchema>;
